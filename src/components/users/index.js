import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import ReactVirtualizedTable from "./array/virtualizedTable";
import { Checkbox, Box, Paper, Grid, Typography, Alert, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

import LaboratoryForm from "./usersForm";
import uuid from "react-uuid";
const api = require("../../utils/API");

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
export default function Users() {
  const filterData = (query, data) => {
    if (!query) {
      return data;
    } else {
      return data.filter((user) => user.nameuser.toLowerCase().includes(query.toLowerCase()));
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [formList, setFormList] = useState([]);
  const [displayAlert, setDisplayAlert] = useState(false);

  const dataFiltered = filterData(searchQuery, users);

  useEffect(() => {
    getUsers();
  }, []);

  function deleteUser(id) {
    api.deleteUser(id, (response) => {
      setDisplayAlert(true);
      Swal.fire({
        title: "User deleted !",
        icon: "success",
        timer: "1000",
      });
    });
  }

  function getUsers() {
    api.getUsers((response) => {
      var data = response;
      data.forEach((user) => {
        user.deleteButton = (
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => deleteAlert(user.userid, user.nameuser)}
          >
            <DeleteIcon />
          </IconButton>
        );
        user.editButton = (
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              editUser(user);
            }}
          >
            <EditIcon />
          </IconButton>
        );
      });
      setUsers(data);
    });
  }

  const deleteAlert = (id, name) => {
    Swal.fire({
      title: "Deleting an user !",
      text: "Do you really want to delete definitively the user: " + name,
      icon: "warning",
      confirmButtonText: "yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
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

  const editUser = (user) => {
    if (formList.length < 1) {
      let tab = [...formList];

      tab.push({
        id: user.userid,
        name: user.nameuser,
        firstname: user.firstnameuser,
        mail: user.mailuser,
        telephone: user.telephoneuser,
      });
      setFormList(tab);
    }
  };

  return (
    <div>
      {users.length != 0 ? (
        <div
          style={{
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h1">Users </Typography>
            <div style={{ padding: 10 }}>
              <Button
                variant="contained"
                onClick={() => {
                  if (formList.length < 1) {
                    const newList = [
                      ...formList,
                      {
                        id: uuid(),
                        firstname: "",
                        name: "",
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
          </Stack>
          <Grid container direction="column" justifyContent="space-evenly" alignItems="flex-start">
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
          <SearchArray searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div style={{ padding: 3 }}>
            {displayAlert == true ? (
              <Alert
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setUsers([]);
                      getUsers();
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
            <ReactVirtualizedTable data={dataFiltered} />
          </div>
        </div>
      ) : (
        <LinearProgress />
      )}
    </div>
  );
}
