import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import ReactVirtualizedTable from "./array/virtualizedTable";
import { Checkbox, Box, Paper, Grid, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

import SiteForm from "./siteForm";
import uuid from "react-uuid";

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
export default function Sites() {
  const filterData = (query, data) => {
    if (!query) {
      return data;
    } else {
      return data.filter((site) => site.namesite.toLowerCase().includes(query.toLowerCase()));
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [sites, setSites] = useState([]);
  const [formList, setFormList] = useState([]);

  const dataFiltered = filterData(searchQuery, sites);

  useEffect(() => {
    getSites();
  }, []);

  function deleteSite(id) {
    fetch(`http://localhost:3001/sites/${id}`, {
      method: "DELETE",
    }).then((response) => {
      getSites();
    });
  }

  function getSites() {
    fetch("http://localhost:3001/sites").then((response) => {
      response.json().then((response) => {
        var data = response;
        data.forEach((site) => {
          site.deleteButton = (
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => deleteAlert(site.siteid, site.namesite)}
            >
              <DeleteIcon />
            </IconButton>
          );
          site.editButton = (
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => {
                editSite(site);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        });
        setSites(data);
      });
    });
  }

  const deleteAlert = (id, name) => {
    Swal.fire({
      title: "Deleting a site !",
      text: "Do you really want to delete definnitvely the site : " + name,
      icon: "warning",
      confirmButtonText: "yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSite(id);
        Swal.fire({
          title: "Site deleted !",
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

  const editSite = (site) => {
    if (formList.length < 1) {
      let tab = [...formList];

      tab.push({
        id: site.siteid,
        buildingNumber: site.buildingnumbersite,
        country: site.countrysite,
        city: site.citysite,
        elevation: site.elevation,
        latitude: site.latitude,
        longitude: site.longitude,
        name: site.namesite.trim(),
        state: site.statesite,
        street: site.streetsite,
      });
      setFormList(tab);
    }
  };

  return (
    <div>
      {sites.length != 0 ? (
        <div
          style={{
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <Typography variant="h1">Sites </Typography>
          <SearchArray searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div style={{ padding: 3 }}>
            <ReactVirtualizedTable data={dataFiltered} />
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
                      buildingnumber: null,
                      country: "",
                      city: "",
                      elevation: "",
                      latitude: "",
                      longitude: "",
                      name: "",
                      state: "",
                      street: "",
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
              <SiteForm onRemove={onRemove} data={value} disabled={index != 0} />
            </Item>
          ))}
        </Box>
      </Grid>
    </div>
  );
}
