import React, { useState, useEffect } from "react";
import { Paper, Skeleton, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { Stack, Divider, Autocomplete, Button, Checkbox, Grid, IconButton } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
// Latest version - v3.0.0 with Tree Shaking to reduce bundle size
import { Country, State, City, Icon } from "country-state-city";
import Swal from "sweetalert2";

import uuid from "react-uuid";
import SendIcon from "@mui/icons-material/Send";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/material.css";
import { isValid } from "date-fns";
const Phones = require("../../utils/phoneRegexp");
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { isNaN } from "formik";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const defaultValues = {
  name: "",
  specie: "",
  author: null,
  reviewer: null,
  research: "",
  laboratories: [],
  isCambium: false,
  isPith: false,
  isDated: false,
  keywords: [],
  values: [],
  length: null,
  sapwood: null,
  dateEnd: null,
};

export default function WoodForm({
  data,
  onRemove,
  disabled,
  dataLaboratories,
  dataSites,
  dataUsers,
  dataSpecies,
  dataKeywords,
  setDisplayAlert,
  isUpdating,
}) {
  const {
    handleSubmit,
    reset,
    control,
    trigger,
    setFocus,
    formState: { errors, isDirty, isSubmitted, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: data || defaultValues,
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [selectedSpecie, setSelectedSpecie] = useState({});
  const [selectedSite, setSelectedSite] = useState({});
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [selectedReviewer, setSelectedReviewer] = useState({});
  const [selectedLaboratories, setSelectedLaboratories] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [research, setResearch] = useState("");
  const [values, setValues] = useState([]);
  const [value, setValue] = useState([]);

  const onSubmit = (dataToSubmit) => {
    let keyworIds = [];
    for (let keyword of dataToSubmit.keywords) {
      keyworIds.push(keyword.keywordid);
    }
    let labIds = [];
    for (let lab of dataToSubmit.laboratories) {
      labIds.push(lab.laboratoryid);
    }
    const newWood = {
      specieid: dataToSubmit.specie.specieid,
      siteid: dataToSubmit.site.siteid,
      authorid: dataToSubmit.author.userid,
      reviewerid: dataToSubmit.reviewer.userid,
      namewood: dataToSubmit.name,
      dateEnd: dataToSubmit.dateEnd,
      length: dataToSubmit.length,
      sapwood: dataToSubmit.sapwood,
      iscambium: dataToSubmit.isCambium,
      ispith: dataToSubmit.isPith,
      research: dataToSubmit.research,
      isDated: dataToSubmit.isDated,
      values: values,
      keywords: keyworIds,
      laboratories: labIds,
    };

    console.log(newWood);

    if (!isUpdating) {
      fetch("http://localhost:3001/woods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWood),
      })
        .then((response) => {
          return response.text();
        })
        .then((res) => {
          Swal.fire({
            title: "Wood created !",
            icon: "success",
            timer: "1000",
          });
          onRemove(data.id);
          setDisplayAlert(true);
        });
    } else {
      fetch(`http://localhost:3001/woods/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWood),
      })
        .then((response) => {
          return response.text();
        })
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "Wood updated !",
            icon: "success",
            timer: "1000",
          });
          onRemove(data.id);
          setDisplayAlert(true);
        });
    }
  };

  useEffect(() => {
    if (data.specie) {
      setSelectedSpecie(data.specie);
    }

    if (data.author) {
      setSelectedAuthor(data.author);
    }
    if (data.reviewer) {
      setSelectedReviewer(data.reviewer);
    }
    if (data.research) {
      setResearch(data.research);
    }
    if (data.site) {
      setSelectedSite(data.site);
    }
    if (data.keywords) {
      setSelectedKeywords(data.keywords);
    }
    if (data.laboratories) {
      setSelectedLaboratories(data.laboratories);
    }
    if (data.values) {
      setValues(data.values);
    }
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const checkLength = (val) => {
    return values.length == val;
  };
  return (
    <div>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={8}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {isUpdating == false ? (
          <Typography variant="h3">Wood creation </Typography>
        ) : (
          <Typography variant="h3">Update wood</Typography>
        )}
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" justifyContent="space-between" alignItems="stretch" spacing={1}>
          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label="Name"
                  variant="filled"
                  required
                  fullWidth
                  inputRef={ref}
                  onChange={onChange}
                  disabled={disabled}
                  error={!!errors?.name}
                  helperText={!!errors?.name ? "Please enter a name" : ""}
                  {...field}
                ></TextField>
              )}
            />

            <Controller
              name="specie"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={dataSpecies}
                  getOptionLabel={(option) => option.libellespecie ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedSpecie}
                  sx={{ width: "50%" }}
                  disabled={disabled}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Specie"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.specie}
                        helperText={!!errors?.specie ? "Select a specie in the list" : ""}
                        onChange={onChange}
                        value={selectedSpecie.libellespecie}
                        required
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    console.log(values);
                    if (values && values.specieid) {
                      onChange(values);
                      setSelectedSpecie(values);
                    }
                  }}
                  value={selectedSpecie.libellespecie ? selectedSpecie : ""}
                />
              )}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="author"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={dataUsers}
                  getOptionLabel={(option) => option.nameuser ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedAuthor}
                  sx={{ width: "50%" }}
                  disabled={disabled}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Author"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.author}
                        helperText={!!errors?.author ? "Select an user in the list" : ""}
                        onChange={onChange}
                        value={selectedAuthor.nameuser}
                        required
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    console.log(values);
                    if (values && values.userid) {
                      onChange(values);
                      setSelectedAuthor(values);
                    }
                  }}
                  value={selectedAuthor.nameuser ? selectedAuthor : ""}
                />
              )}
            />

            <Controller
              name="reviewer"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={dataUsers}
                  getOptionLabel={(option) => option.nameuser ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedReviewer}
                  sx={{ width: "50%" }}
                  disabled={disabled}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Reviewer"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.reviewer}
                        helperText={!!errors?.reviewer ? "Select an user in the list" : ""}
                        onChange={onChange}
                        value={selectedReviewer.nameuser}
                        required
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    console.log(values);
                    if (values && values.userid) {
                      onChange(values);
                      setSelectedReviewer(values);
                    }
                  }}
                  value={selectedReviewer.nameuser ? selectedReviewer : ""}
                />
              )}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="laboratories"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={dataLaboratories}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.namelaboratory ?? option}
                  disabled={disabled}
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
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Laboratories"
                      placeholder="Université de Liège..."
                      error={!!errors?.laboratories}
                      helperText={
                        !!errors?.laboratories ? "Select one or more laboratories in the list" : ""
                      }
                    />
                  )}
                  onChange={(event, values, reason) => {
                    if (values.length >= 0) {
                      onChange(values);
                      console.log(values);
                      setSelectedLaboratories(values);
                    }
                  }}
                  value={selectedLaboratories}
                />
              )}
            />

            <Controller
              name="site"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={dataSites}
                  getOptionLabel={(option) => option.namesite ?? option}
                  isOptionEqualToValue={(option, value) => option == selectedSite}
                  sx={{ width: "50%" }}
                  disabled={disabled}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Site"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.site}
                        helperText={!!errors?.site ? "Select a site in the list" : ""}
                        onChange={onChange}
                        value={selectedSite.namesite}
                        required
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    console.log(values);
                    if (values && values.siteid) {
                      onChange(values);
                      setSelectedSite(values);
                    }
                  }}
                  value={selectedSite.namesite ? selectedSite : ""}
                />
              )}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="isDated"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControlLabel
                  control={
                    <Checkbox checked={value} onChange={onChange} disabled={disabled} {...field} />
                  }
                  label="Dated"
                />
              )}
            />

            <Controller
              name="isCambium"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControlLabel
                  control={
                    <Checkbox checked={value} onChange={onChange} disabled={disabled} {...field} />
                  }
                  label="Cambium"
                />
              )}
            />

            <Controller
              name="isPith"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControlLabel
                  control={
                    <Checkbox checked={value} onChange={onChange} disabled={disabled} {...field} />
                  }
                  label="Pith"
                />
              )}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="research"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, ref, value } }) => (
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
                  style={{ width: 500 }}
                  disabled={disabled}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Research"
                      error={!!errors?.research}
                      helperText={!!errors?.research ? "Select an field in the list" : ""}
                    />
                  )}
                  onChange={(event, values, reason) => {
                    console.log(values);
                    onChange(values);
                    setResearch(values);
                  }}
                  value={research}
                />
              )}
            />

            <Controller
              name="keywords"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={dataKeywords}
                  disableCloseOnSelect
                  disabled={disabled}
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
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Keywords"
                      placeholder="Violin"
                      error={!!errors?.keywords}
                      helperText={
                        !!errors?.keywords
                          ? "Select at least one keyword"
                          : "Select up to five keywords"
                      }
                    />
                  )}
                  onChange={(event, values, reason) => {
                    console.log(selectedKeywords.length);
                    if (
                      values.length >= 0 &&
                      ((!selectedKeywords.length < 5 && values.length < 5) ||
                        selectedKeywords.length < 5)
                    ) {
                      onChange(values);
                      setSelectedKeywords(values);
                      console.log(selectedKeywords);
                    }
                  }}
                  value={selectedKeywords}
                />
              )}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="length"
              control={control}
              rules={{
                required: true,
                validate: checkLength,
              }}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label="length"
                  variant="filled"
                  required
                  fullWidth
                  inputRef={ref}
                  onChange={onChange}
                  disabled={disabled}
                  error={!!errors?.length}
                  helperText={
                    !!errors?.length ? "Please enter a length corresponding to values" : ""
                  }
                  {...field}
                ></TextField>
              )}
            />

            <Controller
              name="sapwood"
              control={control}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label="sapwood"
                  variant="filled"
                  required
                  fullWidth
                  inputRef={ref}
                  onChange={onChange}
                  disabled={disabled}
                  error={!!errors?.sapwood}
                  helperText={!!errors?.sapwood ? "Please enter a sapwood" : ""}
                  {...field}
                ></TextField>
              )}
            />

            <Controller
              name="dateEnd"
              control={control}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label="dateEnd"
                  variant="filled"
                  required
                  fullWidth
                  inputRef={ref}
                  onChange={onChange}
                  disabled={disabled}
                  error={!!errors?.dateEnd}
                  helperText={!!errors?.dateEnd ? "Please enter a dateEnd" : ""}
                  {...field}
                ></TextField>
              )}
            />
          </Stack>
        </Stack>
        <div>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h5">values </Typography>
            <Typography variant="h10">
              You can past data using clipboard import with the following button
            </Typography>
            <IconButton
              color="primary"
              disabled={disabled}
              onClick={(e) => {
                navigator.clipboard.readText().then((res, err) => {
                  var re = /\s+/;
                  var valueList = res.split(re);
                  console.log(valueList);
                  setValues(
                    valueList.filter((value) => {
                      const valueTrimmed = value.trim();
                      return !isNaN(Number(valueTrimmed)) && valueTrimmed != "";
                    })
                  );
                });
              }}
            >
              <ContentPasteIcon />
            </IconButton>
          </Stack>
          <Grid container columns={16}>
            {Array.from(values).map((value, index) => (
              <Grid item columns={16} key={index}>
                <Item>{value}</Item>
              </Grid>
            ))}
          </Grid>
          <h10>lenght: {values.length}</h10>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              label="value"
              variant="filled"
              fullWidth
              disabled={disabled}
              onPaste={(e) => {}}
              onKeyUp={(event) => {
                const val = value.trim();
                if (event.code == "Space" && !isNaN(Number(val)) && val != "") {
                  console.log(val);
                  setValues([...values, val]);
                  setValue("");
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={value}
              error={isNaN(Number(value))}
              helperText={
                isNaN(Number(value))
                  ? "Please select number"
                  : "You can use 'Space' to enter value in the list"
              }
            ></TextField>
            {values.length > 0 ? (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
                spacing={2}
              >
                <Button
                  variant="contained"
                  disabled={disabled}
                  onClick={() => {
                    if (value) {
                      const val = value.trim();
                      if (!isNaN(Number(val)) && val != "") {
                        setValues([...values, val]);
                        setValue("");
                      }
                    }
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  disabled={disabled}
                  color="warning"
                  onClick={() => {
                    let tab = values;
                    tab.pop();
                    setValues([...tab]);
                  }}
                >
                  Remove last
                </Button>
                <Button
                  disabled={disabled}
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setValues([]);
                  }}
                >
                  Clear All
                </Button>
              </Stack>
            ) : null}
          </Stack>
        </div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          spacing={4}
          style={{ padding: 20 }}
        >
          <Button
            variant="outlined"
            color="error"
            disabled={disabled}
            onClick={() => onRemove(data.id)}
          >
            Cancel
          </Button>
          <LoadingButton
            endIcon={<SendIcon />}
            loading={isSubmitting}
            loadingPosition="end"
            variant="contained"
            type="submit"
            disabled={
              disabled ||
              errors?.name ||
              errors?.specie ||
              errors?.author ||
              errors?.reviewer ||
              errors?.laboratories ||
              errors?.site ||
              errors?.research ||
              errors?.length ||
              errors?.sapwood ||
              errors?.dateEnd ||
              errors?.keywords
            }
          >
            Send
          </LoadingButton>
        </Stack>
      </form>
    </div>
  );
}
