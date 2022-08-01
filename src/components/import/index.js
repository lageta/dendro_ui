import "react-dropzone-uploader/dist/styles.css";
import { useState, useEffect } from "react";
import React from "react";
import Dropzone from "react-dropzone-uploader";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import convertBes from "./convertBes";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import uuid from "react-uuid";
import FormControlLabel from "@mui/material/FormControlLabel";

import {
  Paper,
  Typography,
  Stack,
  Autocomplete,
  Checkbox,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import WoodForm from "../woods/woodsForm";
import SiteForm from "../sites/siteForm";
import convertFh from "./convertFH";

export default function Import() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [createSite, setCreateSite] = useState(false);
  const [selectedSite, setSelectedSite] = useState({});
  const [format, setFormat] = useState("");
  const [laboratories, setLaboratories] = useState([]);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [species, setSpecies] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [hideDropzone, setHideDropzone] = useState(false);
  const [formListWood, setFormListWood] = useState([]);
  const [formListSite, setFormListSite] = useState([]);

  useEffect(() => {
    getKeywords();
    getSites();
    getLaboratories();
    getSpecies();
    getUsers();
  }, []);

  useEffect(() => {
    if (formListWood && formListWood.length == 0) {
      setHideDropzone(false);
    }
  }, [formListWood]);

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

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  const handleSubmit = (files, allFiles) => {
    setOpen(true);
    setFiles(files);
    /*for (let file of files) {
      convertFh(file.file, (res) => console.log(res));
    }*/
    allFiles.forEach((f) => f.remove());
  };

  const handleImport = () => {
    setOpen(false);
    switch (format) {
      case "Besançon / BesançonDCCD":
        for (let file of files) {
          convertBes(file.file, (res) => {
            if (selectedSite && !createSite) {
              let data = res[1];
              data.forEach((wood) => {
                wood.site = selectedSite;
              });
              setFormListWood(data);
            } else {
              setFormListWood(res[1]);
            }
            if (createSite) {
              setFormListSite([res[0]]);
            }

            setHideDropzone(true);
          });
        }
        break;

      case "FH":
        for (let file of files) {
          convertFh(file.file, (res) => {
            console.log(res);
            if (selectedSite && !createSite) {
              let data = res[1];
              data.forEach((wood) => {
                wood.site = selectedSite;
              });
              setFormListWood(data);
            } else {
              setFormListWood(res[1]);
            }
            if (createSite) {
              setFormListSite([res[0]]);
            }

            setHideDropzone(true);
          });
        }
        break;
    }
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
  return (
    <>
      {hideDropzone == false ? (
        <Paper style={{ height: "100vh", backgroundColor: "#e1f5fe" }}>
          <Dropzone
            maxFiles={1}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept=".FH, .txt"
            inputContent={
              <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <UploadFileIcon sx={{ fontSize: "10vh" }} />
                <Typography variant="h8">Drag and drop file or click to browse</Typography>
              </Stack>
            }
            styles={{
              dropzone: { height: "100vh", overflow: "auto" },
              dropzoneReject: { borderColor: "red", backgroundColor: "#DAA" },
              inputLabel: (files, extra) => (extra.reject ? { color: "red" } : {}),
            }}
          />
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              <Stack
                direction="rows"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                Import
                <FormControlLabel
                  control={
                    <Switch
                      checked={createSite}
                      onChange={() => setCreateSite(!createSite)}
                      color="primary"
                    />
                  }
                  label="Create site"
                />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <DialogContentText>
                  Please select the format of the file. If you want to create a site with the file
                  you are importing, select 'Create site' (up-right) else select an existing one.
                </DialogContentText>

                <InputLabel id="select-label">Format</InputLabel>
                <Select
                  style={{ width: "20vw" }}
                  labelId="select-label"
                  value={format}
                  label="Format"
                  onChange={(e) => {
                    setFormat(e.target.value);
                  }}
                >
                  <MenuItem value={"Besançon / BesançonDCCD"}>Besançon / BesançonDCCD</MenuItem>
                  <MenuItem value={"FH"}>FH</MenuItem>
                </Select>
                {createSite == false ? (
                  <>
                    <Autocomplete
                      options={sites}
                      getOptionLabel={(option) => option.namesite ?? option}
                      isOptionEqualToValue={(option, value) => option == selectedSite}
                      sx={{ width: "20vw" }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            label="Site"
                            margin="normal"
                            variant="filled"
                            value={selectedSite.namesite ?? ""}
                            error={selectedSite.length <= 0}
                            required
                          />
                        );
                      }}
                      onChange={(event, values, reason) => {
                        console.log(values);
                        if (values && values.siteid) {
                          setSelectedSite(values);
                        }
                      }}
                      value={selectedSite.namesite ? selectedSite : ""}
                    />
                  </>
                ) : null}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleImport}
                disabled={(!selectedSite.namesite && !createSite) || format.length <= 0}
              >
                Import
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      ) : (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setHideDropzone(false);
              setFiles([]);
            }}
          >
            Cancel
          </Button>
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
              {formListSite.map((value, index) => (
                <Item key={uuid()} color={index == 0 ? "primary" : "#eeeeee"}>
                  <SiteForm
                    onRemove={(id) => {
                      setFormListSite([...formListSite].filter((value) => value.id != id));
                    }}
                    data={value}
                    disabled={index != 0}
                    setDisplayAlert={(e) => {}}
                    isUpdating={false}
                  />
                </Item>
              ))}
            </Box>
          </Grid>
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
              {formListWood.map((value, index) =>
                index < 5 ? (
                  <Item
                    key={uuid()}
                    color={!(index != 0 || formListSite.length > 0) ? "primary" : "#eeeeee"}
                  >
                    <WoodForm
                      onRemove={(id) => {
                        setFormListWood([...formListWood].filter((value) => value.id != id));
                      }}
                      data={value}
                      disabled={index != 0 || formListSite.length > 0}
                      dataLaboratories={laboratories}
                      dataSites={sites}
                      dataUsers={users}
                      dataSpecies={species}
                      dataKeywords={keywords}
                      setDisplayAlert={(e) => {}}
                      isUpdating={false}
                    />
                  </Item>
                ) : null
              )}
            </Box>
          </Grid>
        </>
      )}
    </>
  );
}
