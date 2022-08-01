import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { Stack, Divider, Autocomplete, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
// Latest version - v3.0.0 with Tree Shaking to reduce bundle size
import { Country, State, City, Icon } from "country-state-city";
import Swal from "sweetalert2";

import uuid from "react-uuid";
import SendIcon from "@mui/icons-material/Send";
import PhoneInput from "react-phone-input-2";
const api = require("../../utils/API");

import "react-phone-input-2/lib/material.css";
import { isValid } from "date-fns";
const Phones = require("../../utils/phoneRegexp");

const defaultValues = {
  buildingNumber: "",
  country: "",
  city: "",
  name: "",
  description: "",
  state: "",
  street: "",
  mail: "",
  telephone: "",
};

export default function LaboratoryForm({ data, onRemove, disabled, setDisplayAlert }) {
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

  const onSubmit = (dataToSubmit) => {
    const newLab = {
      buildingnumberlaboratory:
        dataToSubmit.buildingNumber == "" ? null : dataToSubmit.buildingNumber,
      countrylaboratory: dataToSubmit.country,
      citylaboratory: dataToSubmit.city == "" ? null : dataToSubmit.city,
      namelaboratory: dataToSubmit.name,
      statelaboratory: dataToSubmit.state,
      streetlaboratory: dataToSubmit.street == "" ? null : dataToSubmit.street,
      maillaboratory: dataToSubmit.mail,
      telephonelaboratory: dataToSubmit.telephone,
      descriptionlaboratory: dataToSubmit.description,
    };

    if (data.name == "") {
      api.createLaboratory(newLab, (response) => {
        onRemove(data.id);
        setDisplayAlert(true);
      });
    } else {
      api.editLaboratory(data.id, newLab, (response) => {
        onRemove(data.id);
        setDisplayAlert(true);
      });
    }
  };
  const [telephone, setTelephone] = useState();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countrySelected, setCountrySelected] = useState(control._defaultValues.country ?? "");
  const [stateSelected, setStateSelected] = useState(control._defaultValues.state ?? "");

  useEffect(() => {
    setTelephone(control._defaultValues.telephone);
    let dataCountries = Country.getAllCountries();
    setCountries(dataCountries);
    if (control._defaultValues.country != "") {
      let country = dataCountries.filter((country) => country.name == countrySelected)[0];
      setCountrySelected(country);

      if (control._defaultValues.state != "") {
        let dataStates = State.getStatesOfCountry(country.isoCode);
        let state = dataStates.filter((state) => state.name == stateSelected)[0];

        setStateSelected(state);
      }
    }
  }, []);

  useEffect(() => {
    if (countrySelected) {
      let dataStates = State.getStatesOfCountry(countrySelected.isoCode);
      setStates(dataStates);
    }
  }, [countrySelected]);

  useEffect(() => {
    if (stateSelected) {
      const dataCities = City.getCitiesOfState(stateSelected.countryCode, stateSelected.isoCode);
      if (dataCities.length == 0) {
        setCities(City.getCitiesOfCountry(stateSelected.countryCode));
      } else {
        setCities(dataCities);
      }
    }
  }, [stateSelected]);

  const containCountries = (value) => {
    var test = false;
    countries.forEach((item) => {
      if (item.name == value) {
        test = true;
      }
    });
    return test;
  };
  const containStates = (value) => {
    var test = false;
    states.forEach((item) => {
      if (item.name == value) {
        test = true;
      }
    });
    return test;
  };
  const containCities = (value) => {
    if (value && value != "") {
      var test = false;
      cities.forEach((item) => {
        if (item.name == value) {
          test = true;
        }
      });
      return test;
    }
    return true;
  };

  const isValidPhoneNumber = (value) => {
    return value.length > 2;
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
        {data.name == "" ? (
          <Typography variant="h3">Laboratory creation </Typography>
        ) : (
          <Typography variant="h3">Update laboratory</Typography>
        )}
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" justifyContent="space-between" alignItems="stretch" spacing={1}>
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
            name="description"
            control={control}
            render={({ field: { ref, onChange, ...field } }) => (
              <TextField
                label="Description"
                multiline
                rows={4}
                variant="filled"
                fullWidth
                inputRef={ref}
                onChange={onChange}
                disabled={disabled}
                {...field}
              ></TextField>
            )}
          />

          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="mail"
              control={control}
              rules={{
                required: true,
                pattern: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/,
              }}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label="Mail"
                  variant="filled"
                  required
                  fullWidth
                  inputRef={ref}
                  onChange={onChange}
                  disabled={disabled}
                  error={!!errors?.mail}
                  helperText={!!errors?.mail ? "Please enter a valid mail adress" : ""}
                  {...field}
                ></TextField>
              )}
            />
            <Controller
              name="telephone"
              control={control}
              rules={{
                required: true,
                validate: isValidPhoneNumber,
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country="be"
                  onChange={(value) => {
                    setTelephone(value);
                    onChange(value);
                  }}
                  value={telephone}
                />
              )}
            />
          </Stack>
          {errors?.telephone ? <li>Please enter a correct phone number</li> : null}

          <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Controller
              name="country"
              control={control}
              rules={{
                required: true,
                validate: containCountries,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option.name ?? option}
                  isOptionEqualToValue={(option, value) => option.name == value}
                  sx={{ width: "50%" }}
                  disabled={disabled}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Country"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.country}
                        helperText={!!errors?.country ? "Select a country in the list" : ""}
                        onChange={onChange}
                        required
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    if (values && values.name) {
                      onChange(values.name);
                      setCountrySelected(values);
                      setStateSelected("");
                    }
                  }}
                  value={value}
                />
              )}
            />

            <Controller
              name="state"
              control={control}
              rules={{
                required: true,
                validate: containStates,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  disabled={disabled ? true : countrySelected == "" ? true : false}
                  options={states}
                  getOptionLabel={(option) => option.name ?? option}
                  sx={{ width: "50%" }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={uuid()}>
                        {option.name}
                      </li>
                    );
                  }}
                  isOptionEqualToValue={(option, value) => option.name == value}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="State"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.state}
                        helperText={!!errors?.state ? "Select a state in the list" : ""}
                        required
                        onChange={onChange}
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    if (values && values.name) {
                      onChange(values.name);
                      setStateSelected(values);
                    }
                  }}
                  value={value}
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              rules={{
                required: true,
                validate: containCities,
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  disabled={disabled ? true : stateSelected == "" ? true : false}
                  options={cities}
                  getOptionLabel={(option) => option.name ?? option}
                  sx={{ width: "50%" }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={uuid()}>
                        {option.name}
                      </li>
                    );
                  }}
                  isOptionEqualToValue={(option, value) => option.name == value}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="City"
                        margin="normal"
                        variant="filled"
                        error={!!errors?.city}
                        helperText={!!errors?.city ? "Select a city in the list" : ""}
                        required
                        onChange={onChange}
                      />
                    );
                  }}
                  onChange={(event, values, reason) => {
                    if (values && values.name) {
                      onChange(values.name);
                    }
                  }}
                  value={value}
                />
              )}
            />
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
            <Controller
              name="street"
              control={control}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label="Street"
                  variant="filled"
                  fullWidth
                  inputRef={ref}
                  onChange={onChange}
                  disabled={disabled}
                  helperText="exemple: Acton Street"
                  {...field}
                ></TextField>
              )}
            />
            <Controller
              name="buildingNumber"
              control={control}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  variant="filled"
                  inputRef={ref}
                  onChange={onChange}
                  type="number"
                  {...field}
                  label="Building number"
                  disabled={disabled}
                ></TextField>
              )}
            />
          </Stack>
        </Stack>
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
              errors?.country ||
              errors?.state ||
              errors?.city ||
              errors?.mail ||
              errors?.telephone
            }
          >
            Send
          </LoadingButton>
        </Stack>
      </form>
    </div>
  );
}
