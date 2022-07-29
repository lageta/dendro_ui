import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import ReactVirtualizedTable from "./array/virtualizedTable";
import { Checkbox, Box, Paper, Grid, Typography, Alert } from "@mui/material";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

import LaboratoryForm from "./laboratoriesForm";
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
export default function Laboratories() {
  const filterData = (query, data) => {
    if (!query) {
      return data;
    } else {
      return data.filter((lab) => lab.namelaboratory.toLowerCase().includes(query.toLowerCase()));
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [laboratories, setLaboratories] = useState([]);
  const [formList, setFormList] = useState([]);
  const [displayAlert, setDisplayAlert] = useState(false);
  const dataFiltered = filterData(searchQuery, laboratories);

  useEffect(() => {
    getLaboratories();
  }, []);

  function deleteLaboratory(id) {
    fetch(`http://localhost:3001/laboratories/${id}`, {
      method: "DELETE",
    }).then((response) => {
      setDisplayAlert(true);
    });
  }

  function getLaboratories() {
    fetch("http://localhost:3001/laboratories").then((response) => {
      response.json().then((response) => {
        var data = response;
        data.forEach((lab) => {
          lab.deleteButton = (
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => deleteAlert(lab.laboratoryid, lab.namelaboratory)}
            >
              <DeleteIcon />
            </IconButton>
          );
          lab.editButton = (
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => {
                editLaboratory(lab);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        });
        setLaboratories(data);
      });
    });
  }

  const deleteAlert = (id, name) => {
    Swal.fire({
      title: "Deleting a laboratory !",
      text: "Do you really want to delete definitively the laboratory: " + name,
      icon: "warning",
      confirmButtonText: "yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLaboratory(id);
        Swal.fire({
          title: "Laboratory deleted !",
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

  const editLaboratory = (lab) => {
    if (formList.length < 1) {
      let tab = [...formList];

      tab.push({
        id: lab.laboratoryid,
        buildingNumber: lab.buildingnumberlaboratory,
        country: lab.countrylaboratory,
        city: lab.citylaboratory,
        name: lab.namelaboratory,
        description: lab.descriptionlaboratory,
        state: lab.statelaboratory,
        street: lab.streetlaboratory,
        mail: lab.maillaboratory,
        telephone: lab.telephonelaboratory,
      });
      setFormList(tab);
    }
  };

  return (
    <div>
      {laboratories.length != 0 ? (
        <div
          style={{
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <Typography variant="h1">laboratories </Typography>
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
                      setLaboratories([]);
                      getLaboratories();
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
                      buildingNumber: "",
                      country: "",
                      city: "",
                      name: "",
                      state: "",
                      street: "",
                      mail: "",
                      telephone: "",
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
              <LaboratoryForm
                onRemove={onRemove}
                data={value}
                disabled={index != 0}
                setDisplayAlert={setDisplayAlert}
              />
            </Item>
          ))}
        </Box>
      </Grid>
    </div>
  );
}
