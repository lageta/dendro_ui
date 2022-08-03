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

import "react-phone-input-2/lib/material.css";
import { isValid } from "date-fns";
const api = require("../../utils/API");

const Phones = require("../../utils/phoneRegexp");

const defaultValues = {
  name: "",
  mail: "",
  telephone: "",
  firstname: "",
};

export default function UsersForm({ data, onRemove, disabled, setDisplayAlert }) {
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
    const newUser = {
      nameuser: dataToSubmit.name,
      firstnameuser: dataToSubmit.firstname,
      mailuser: dataToSubmit.mail,
      telephoneuser: dataToSubmit.telephone,
    };

    if (data.name == "") {
      api.createUser(newUser, (res) => {
        onRemove(data.id);
        setDisplayAlert(true);
      });
    } else {
      api.editUser(data.id, newUser, (res) => {
        onRemove(data.id);
        setDisplayAlert(true);
      });
    }
  };
  const [telephone, setTelephone] = useState();

  useEffect(() => {
    setTelephone(control._defaultValues.telephone);
  }, []);

  /* const isValidPhoneNumber = (value) => {
    return value.length > 2;
  };
*/
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
          <Typography variant="h3">User creation </Typography>
        ) : (
          <Typography variant="h3">Update user</Typography>
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
            name="firstname"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, onChange, ...field } }) => (
              <TextField
                label="Firstname"
                variant="filled"
                required
                fullWidth
                inputRef={ref}
                onChange={onChange}
                disabled={disabled}
                error={!!errors?.firstname}
                helperText={!!errors?.firstname ? "Please enter a firstname" : ""}
                {...field}
              ></TextField>
            )}
          />

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
            rules={
              {
                // required: true,
                //validate: isValidPhoneNumber,
              }
            }
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
          {errors?.telephone ? <li>Please enter a correct phone number</li> : null}
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
              disabled || errors?.name || errors?.mail || errors?.telephone || errors?.firstname
            }
          >
            Send
          </LoadingButton>
        </Stack>
      </form>
    </div>
  );
}
