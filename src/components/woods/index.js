import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import ReactVirtualizedTable from "./array/virtualizedTable";
import { Checkbox, Box, Paper, Grid, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

import WoodForm from "./woodsForm";
import uuid from "react-uuid";
import { get } from "react-hook-form";

const SearchArray = ({ setSearchQuery }) => (
  <div
    style={{
      display: "flex",
      alignSelf: "left",
      justifyContent: "center",
      flexDirection: "column",
      padding: 20,
    }}
  >
    <form>
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
        label="Enter query"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton type="submit" aria-label="search" disabled>
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </form>
  </div>
);
export default function Woods() {
  const filterData = (query, data) => {
    if (!query) {
      return data;
    } else {
      return data.filter((wood) => wood.namewood.toLowerCase().includes(query.toLowerCase()));
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [woods, setWoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [dataPopulated, setDatapopulated] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [species, setSpecies] = useState([]);
  const [formList, setFormList] = useState([]);
  const [displayAlert, setDisplayAlert] = useState(false);
  const dataFiltered = filterData(searchQuery, dataPopulated);

  useEffect(() => {
    getWoods();
    getKeywords();
    getSites();
    getLaboratories();
    getSpecies();
    getUsers();
  }, []);

  useEffect(() => {
    if (
      woods.length > 0 &&
      users.length &&
      sites.length > 0 &&
      species.length > 0 &&
      laboratories.length > 0 &&
      keywords.length > 0 &&
      dataPopulated.length == 0
    ) {
      let data = [];
      woods.forEach((wood) => {
        let woodToPopulate = wood;
        populateUsers(woodToPopulate);
        populateSites(woodToPopulate);
        populateSpecies(woodToPopulate);
        populateKeywords(woodToPopulate);
        populateLaboratories(woodToPopulate);
        woodToPopulate.keywordsToString = keywordsToString(woodToPopulate.keywords);
        woodToPopulate.laboratoriesToString = laboratoriesToString(woodToPopulate.laboratories);
        woodToPopulate.authorToString = wood.author.nameuser;
        woodToPopulate.reviewerToString = wood.reviewer.nameuser;
        woodToPopulate.specieToString = woodToPopulate.specie.libellespecie;
        wood.deleteButton = (
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => deleteAlert(wood.woodid, wood.namewood)}
          >
            <DeleteIcon />
          </IconButton>
        );
        wood.editButton = (
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              editWood(woodToPopulate);
            }}
          >
            <EditIcon />
          </IconButton>
        );
        wood.dated = <Checkbox checked={wood.isdated} disabled color="success" />;
        data.push(woodToPopulate);
      });
      setDatapopulated(data);
    }
  }, [sites, users, species, woods, laboratories, keywords]);

  const keywordsToString = (keywords) => {
    let label = "";
    for (let keyword of keywords) {
      label = label + " " + keyword.libellekeyword + ",";
    }
    return label.substring(0, label.length - 1);
  };
  const laboratoriesToString = (laboratories) => {
    let label = "";
    for (let lab of laboratories) {
      label = label + " " + lab.namelaboratory + ",";
    }
    return label.substring(0, label.length - 1);
  };

  const populateUsers = (wood) => {
    wood.author = getUser(wood.authorid);
    wood.reviewer = getUser(wood.reviewerid);
    return wood;
  };

  const populateSites = (wood) => {
    wood.site = getSite(wood.siteid);
    return wood;
  };

  const populateSpecies = (wood) => {
    wood.specie = getSpecie(wood.specieid);
    return wood;
  };

  const populateKeywords = (wood) => {
    wood.keywords = [];
    if (wood.keywordsid) {
      wood.keywordsid.forEach((id) => wood.keywords.push(getKeyword(id)));
    }
    return wood;
  };

  const populateLaboratories = (wood) => {
    wood.laboratories = [];
    if (wood.laboratoriesid) {
      wood.laboratoriesid.forEach((id) => wood.laboratories.push(getLaboratory(id)));
    }
    return wood;
  };
  const getUser = (id) => {
    for (let user of users) {
      if (user.userid == id) {
        return user;
      }
    }
    return null;
  };

  const getSite = (id) => {
    for (let site of sites) {
      if (site.siteid == id) {
        return site;
      }
    }
    return null;
  };

  const getSpecie = (id) => {
    for (let specie of species) {
      if (specie.specieid == id) {
        return specie;
      }
    }
    return null;
  };

  const getKeyword = (id) => {
    for (let keyword of keywords) {
      if (keyword.keywordid == id) {
        return keyword;
      }
    }
    return null;
  };

  const getLaboratory = (id) => {
    for (let laboratory of laboratories) {
      if (laboratory.laboratoryid == id) {
        return laboratory;
      }
    }
    return null;
  };

  function deleteWood(id) {
    fetch(`http://localhost:3001/woods/${id}`, {
      method: "DELETE",
    }).then((response) => {
      alert(response);
      setDisplayAlert(true);
    });
  }

  function getWoods() {
    fetch("http://localhost:3001/woods").then((response) => {
      response.json().then((response) => {
        var data = response;
        setWoods(data);
      });
    });
  }
  function getUsers() {
    fetch("http://localhost:3001/users").then((response) => {
      response.json().then((response) => {
        var data = response;
        setUsers(data);
      });
    });
  }
  function getSites() {
    fetch("http://localhost:3001/sites").then((response) => {
      response.json().then((response) => {
        var data = response;
        setSites(data);
      });
    });
  }
  function getKeywords() {
    fetch("http://localhost:3001/keywords").then((response) => {
      response.json().then((response) => {
        var data = response;
        setKeywords(data);
      });
    });
  }
  function getSpecies() {
    fetch("http://localhost:3001/species").then((response) => {
      response.json().then((response) => {
        var data = response;
        setSpecies(data);
      });
    });
  }
  function getLaboratories() {
    fetch("http://localhost:3001/laboratories").then((response) => {
      response.json().then((response) => {
        var data = response;
        setLaboratories(data);
      });
    });
  }
  const deleteAlert = (id, name) => {
    Swal.fire({
      title: "Deleting a wood !",
      text: "Do you really want to delete definitively the wood: " + name,
      icon: "warning",
      confirmButtonText: "yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWood(id);
        Swal.fire({
          title: "Wood deleted !",
          icon: "success",
          timer: "1000",
        });
      } else if (result.isDenied) {
        // nothing
      }
    });
  };
  const Item = styled(Paper)(({ theme, color }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: color,
    // height: 60,
    // lineHeight: "60px",
    padding: 60,
  }));

  const onRemove = (id) => {
    setFormList([...formList].filter((value) => value.id != id));
  };

  const editWood = (wood) => {
    if (formList.length < 1) {
      let tab = [...formList];

      tab.push({
        id: wood.woodid,
        name: wood.namewood,
        specie: wood.specie,
        author: wood.author,
        reviewer: wood.reviewer,
        research: wood.research,
        laboratories: wood.laboratories,
        isCambium: wood.iscambium,
        isPith: wood.ispith,
        isDated: wood.isdated,
        keywords: wood.keywords,
        values: wood.values,
        length: wood.length,
        site: wood.site,
        sapwood: wood.sapwood,
        dateEnd: wood.dateend,
      });
      console.log(tab);
      setFormList(tab);
    }
  };

  return (
    <div>
      {dataPopulated.length > 0 ? (
        <div
          style={{
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <Typography variant="h1">Woods </Typography>
          <SearchArray searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div style={{ padding: 3 }}>
            <ReactVirtualizedTable data={dataFiltered} />
            {displayAlert == true ? (
              <Alert
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setDatapopulated([]);
                      getWoods();
                      setDisplayAlert(false);
                    }}
                  >
                    REFRESH
                  </Button>
                }
                variant="outlined"
                severity="success"
                color="info"
              >
                Data have been changed — Click refresh to sync the changes !
              </Alert>
            ) : null}
          </div>
          <div style={{ padding: 10 }}>
            <Button
              variant="contained"
              onClick={() => {
                if (formList.length < 1) {
                  const newList = [
                    ...formList,
                    {
                      id: uuid(),
                      name: "",
                      specie: null,
                      author: null,
                      reviewer: null,
                      research: null,
                      laboratories: [],
                      isCambium: false,
                      isPith: false,
                      isDated: false,
                      keywords: [],
                      values: [],
                      length: null,
                      site: null,
                      sapwood: null,
                      dateEnd: null,
                    },
                  ];
                  setFormList(newList);
                }
              }}
            >
              Create
            </Button>
          </div>
        </div>
      ) : (
        <LinearProgress />
      )}

      <Grid container direction="column" justifyContent="space-evenly" alignItems="center">
        <Box
          sx={{
            p: 2,
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {formList.map((value, index) => (
            <Item key={uuid()} color={index == 0 ? "primary" : "#eeeeee"}>
              <WoodForm
                onRemove={onRemove}
                data={value}
                disabled={index != 0}
                dataLaboratories={laboratories}
                dataSites={sites}
                dataUsers={users}
                dataSpecies={species}
                dataKeywords={keywords}
                setDisplayAlert={setDisplayAlert}
              />
            </Item>
          ))}
        </Box>
      </Grid>
    </div>
  );
}
