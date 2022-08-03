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
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
const api = require("../../utils/API");

import {
  Paper,
  Typography,
  Stack,
  Autocomplete,
  Checkbox,
  Divider,
  Grid,
  Box,
  Alert,
} from "@mui/material";
import WoodForm from "../woods/woodsForm";
import SiteForm from "../sites/siteForm";
import convertFh from "./convertFh";

export default function Import() {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [createSite, setCreateSite] = useState(false);
  //
  const [selectedSpecie, setSelectedSpecie] = useState({});
  const [selectedSite, setSelectedSite] = useState({});
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [selectedReviewer, setSelectedReviewer] = useState({});
  const [selectedLaboratories, setSelectedLaboratories] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [research, setResearch] = useState("");
  //
  const [format, setFormat] = useState("");
  const [laboratories, setLaboratories] = useState([]);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [species, setSpecies] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [hideDropzone, setHideDropzone] = useState(false);
  const [formListWood, setFormListWood] = useState([]);
  const [formListSite, setFormListSite] = useState([]);
  const [woodsString, setWoodsString] = useState([]);

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
    api.getUsers((response) => {
      var data = response;
      setUsers(data);
    });
  }
  function getSites() {
    api.getSites((response) => {
      var data = response;
      setSites(data);
    });
  }
  function getKeywords() {
    api.getKeywords((response) => {
      var data = response;
      setKeywords(data);
    });
  }
  function getSpecies() {
    api.getSpecies((response) => {
      var data = response;
      setSpecies(data);
    });
  }
  function getLaboratories() {
    api.getLaboratories((response) => {
      var data = response;
      setLaboratories(data);
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
    setAllFiles(allFiles);
    /*for (let file of files) {
      convertFh(file.file, (res) => console.log(res));
    }*/
  };

  const handleImport = () => {
    setOpen(false);
    switch (format) {
      case "Besançon / BesançonDCCD":
        for (let file of files) {
          convertBes(file.file, (res) => {
            setFormListWood(populateWoods(res[1]));
            if (createSite) {
              setFormListSite([res[0]]);
            }
            setWoodsString(res[2]);
            setHideDropzone(true);
            allFiles.forEach((f) => f.remove());
          });
        }
        break;

      case "FH":
        for (let file of files) {
          convertFh(file.file, (res) => {
            setFormListWood(populateWoods(res[1]));
            if (createSite) {
              setFormListSite([res[0]]);
            }
            setWoodsString(res[2]);
            setHideDropzone(true);
            allFiles.forEach((f) => f.remove());
          });
        }
        break;
    }
  };

  const populateWoods = (woods) => {
    woods.forEach((wood) => {
      if (selectedSite && selectedSite.namesite != "" && !createSite) {
        wood.site = selectedSite;
      }
      if (selectedSpecie && selectedSpecie.libellespecie != "") {
        wood.specie = selectedSpecie;
      }

      if (selectedAuthor && selectedAuthor.nameuser != "") {
        wood.author = selectedAuthor;
      }

      if (selectedReviewer && selectedReviewer != "") {
        wood.reviewer = selectedReviewer;
      }

      if (selectedLaboratories && selectedLaboratories.length > 0) {
        wood.laboratories = selectedLaboratories;
      }

      if (selectedKeywords && selectedKeywords.length > 0) {
        wood.keywords = selectedKeywords;
      }

      if (research && research.length > 0) {
        wood.research = research;
      }
    });
    return woods;
  };
  const Item = styled(Paper)(({ theme, color }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: color,
    // height: 60,
    // lineHeight: "60px",
    width: "45vw",
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
                  you are importing, select Create site (up-right) else select an existing one.
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
                <DialogContentText>
                  Shared propreties between the woods of the files you are importing. The propreties
                  can be editated individually later.
                </DialogContentText>
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
                          />
                        );
                      }}
                      onChange={(event, values, reason) => {
                        console.log(values);
                        if (values && values.siteid) {
                          setSelectedSite(values);
                        } else {
                          setSelectedSite({});
                        }
                      }}
                      value={selectedSite.namesite ? selectedSite : ""}
                    />
                  </>
                ) : null}
                <Autocomplete
                  options={species}
                  getOptionLabel={(option) => option.libellespecie ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedSpecie}
                  sx={{ width: "20vw" }}
                  clearOnEscape
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Specie"
                        margin="normal"
                        variant="filled"
                        value={selectedSpecie.libellespecie}
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    if (values && values.specieid) {
                      setSelectedSpecie(values);
                    } else {
                      setSelectedSpecie({});
                    }
                  }}
                  onReset={() => console.log(reset)}
                  value={selectedSpecie.libellespecie ? selectedSpecie : ""}
                />
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option.nameuser ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedAuthor}
                  sx={{ width: "20vw" }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Author"
                        margin="normal"
                        variant="filled"
                        value={selectedAuthor.nameuser}
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    if (values && values.userid) {
                      setSelectedAuthor(values);
                    } else {
                      setSelectedAuthor({});
                    }
                  }}
                  value={selectedAuthor.nameuser ? selectedAuthor : ""}
                />

                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option.nameuser ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedReviewer}
                  sx={{ width: "20vw" }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Reviewer"
                        margin="normal"
                        variant="filled"
                        value={selectedReviewer.nameuser}
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    console.log(values);
                    if (values && values.userid) {
                      setSelectedReviewer(values);
                    } else {
                      setSelectedReviewer({});
                    }
                  }}
                  value={selectedReviewer.nameuser ? selectedReviewer : ""}
                />

                <Autocomplete
                  multiple
                  options={laboratories}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.namelaboratory ?? option}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.namelaboratory}
                    </li>
                  )}
                  sx={{ width: "20vw" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Laboratories"
                      placeholder="Université de Liège..."
                    />
                  )}
                  onChange={(event, values, reason) => {
                    if (values.length >= 0) {
                      setSelectedLaboratories(values);
                    }
                  }}
                  value={selectedLaboratories}
                />
                <Autocomplete
                  options={[
                    "Archaeology",
                    "Built Heritage",
                    "Climatology",
                    "Dendroecology",
                    "Furniture",
                    "Mobilia",
                    "Musical Instrument",
                    "Other",
                    "Painting",
                    "Paleo-vegetation",
                    "Ship Archaeology",
                    "Standing Trees",
                    "Woodcarving",
                  ]}
                  disableCloseOnSelect
                  style={{ width: "20vw" }}
                  renderInput={(params) => (
                    <TextField {...params} variant="filled" label="Research" />
                  )}
                  onChange={(event, values, reason) => {
                    setResearch(values);
                  }}
                  value={research}
                />
                <Autocomplete
                  multiple
                  options={keywords}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.libellekeyword}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.libellekeyword}
                    </li>
                  )}
                  style={{ width: "20vw" }}
                  renderInput={(params) => (
                    <TextField {...params} variant="filled" label="Keywords" placeholder="Violin" />
                  )}
                  onChange={(event, values, reason) => {
                    if (
                      values.length >= 0 &&
                      ((!selectedKeywords.length < 5 && values.length < 5) ||
                        selectedKeywords.length < 5)
                    ) {
                      setSelectedKeywords(values);
                    }
                  }}
                  value={selectedKeywords}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleImport} disabled={format.length <= 0}>
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
              setFormListSite([]);
              setFormListWood([]);
            }}
          >
            Cancel
          </Button>
          {formListSite.length > 3 ? (
            <Alert variant="outlined" severity="warning" color="warning">
              {formListSite.length - 3} — Site are hidden !
            </Alert>
          ) : null}
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
              {formListSite.map((value, index) =>
                index < 5 ? (
                  <Item key={uuid()} color={index == 0 ? "primary" : "#eeeeee"}>
                    <SiteForm
                      onRemove={(id) => {
                        setFormListSite([...formListSite].filter((value) => value.id != id));
                      }}
                      data={value}
                      disabled={index != 0}
                      setDisplayAlert={(e) => {
                        getSites();
                      }}
                      isUpdating={false}
                    />
                  </Item>
                ) : null
              )}
            </Box>
          </Grid>
          {formListWood.length > 5 ? (
            <Alert variant="outlined" severity="warning" color="warning">
              {formListWood.length - 5} — Woods are hidden !
            </Alert>
          ) : null}
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
                  <>
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
                    <div>
                      {woodsString[index].split("\n").map((i, key) => {
                        return <div key={key}>{i}</div>;
                      })}
                    </div>
                  </>
                ) : null
              )}
            </Box>
          </Grid>
        </>
      )}
    </>
  );
}
