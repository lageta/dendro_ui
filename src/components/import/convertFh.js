import uuid from "react-uuid";
import Swal from "sweetalert2";

export default function convertFh(file, callback) {
  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function () {
    try {
      const text = reader.result;
      const nbWood = text.split("HEADER:").length - 1;
      const lines = text.split(/\r?\n/);
      const words = [];
      for (let line of lines) {
        const value = line.trim();
        if (value != "") {
          words.push(value.split(" "));
        }
      }
      const woodsString = [];
      let tab = [];
      for (let val of words) {
        if (val[0] == "HEADER:") {
          woodsString.push(tab);
          tab = [];
        }
        if (isNaN(Number(val[0]))) {
          tab.push(
            val
              .filter((data) => data.trim() != "" && data.trim() != "0")
              .map((data) => {
                if (isNaN(Number(data))) {
                  return data.split("=");
                } else {
                  return [data];
                }
              })[0]
          );
        } else {
          tab.push(val.filter((data) => data.trim() != "" && data.trim() != "0"));
        }
      }
      woodsString.push(tab);
      woodsString.shift();
      const resWood = [];
      for (let wood of woodsString) {
        let name = "";
        let specie = null;
        let author = null;
        let reviewer = null;
        let research = null;
        let laboratories = [];
        let isCambium = false;
        let isPith = false;
        let isDated = false;
        let keywords = [];
        let values = [];
        let length = null;
        let sapwood = null;
        let dateEnd = null;
        for (let attribute of wood) {
          switch (attribute[0]) {
            case "KeyCode":
              name = attribute[1];
              break;
            case "Length":
              length = attribute[1];
              break;
            case "WaldKante":
              if (attribute[1] == "P") {
                isPith = true;
              }
              break;
            case "Pith":
              if (attribute[1] == "P") {
                isPith = true;
              }
              break;
            case "DateEnd":
              dateEnd = attribute[1];
              break;

            case "SapWoodRings":
              if (!isNaN(Number(attribute[1]))) {
                sapwood = length - attribute[1];
              }
              break;

            default:
              if (!isNaN(Number(attribute[0]))) {
                values.push(attribute);
              }
          }
        }
        tab = [];
        for (let array of values) {
          tab = tab.concat(array);
        }
        values = tab;

        resWood.push({
          id: uuid(),
          name: name,
          specie: specie,
          author: author,
          reviewer: reviewer,
          research: research,
          laboratories: laboratories,
          isCambium: isCambium,
          isPith: isPith,
          isDated: isDated,
          keywords: keywords,
          values: values,
          length: length,
          sapwood: sapwood,
          dateEnd: dateEnd,
        });
      }

      let site = {
        id: uuid(),
        buildingnumber: null,
        country: "",
        city: "",
        elevation: "",
        latitude: "",
        longitude: "",
        name: file.name.split(".")[0],
        state: "",
        street: "",
      };

      for (let attribute of woodsString[0]) {
        switch (attribute[0]) {
          case "Longitude":
            site.longitude = attribute[1];
            break;
          case "Latitude":
            site.latitude = attribute[1];
            break;
          case "Elev":
            site.elevation = attribute[1];
            break;
        }
      }

      callback([site, resWood]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the import!",
        footer: "Make sure you have selected the correct format",
      });
    }
  };
  reader.onerror = function () {
    console.log(reader.error);
  };
}
