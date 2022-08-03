import uuid from "react-uuid";
import Swal from "sweetalert2";

export default function convertBes(file, callback) {
  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function () {
    try {
      const text = reader.result;
      const nbWood = text.split("VAL").length - 1;
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
        tab.push(val);
        if (val[0] == ";") {
          woodsString.push(tab);
          tab = [];
        }
      }

      const resWood = [];
      for (let wood of woodsString) {
        let name = "";
        let specie = "";
        let author = null;
        let reviewer = null;
        let research = "";
        let laboratories = [];
        let isCambium = false;
        let isPith = false;
        let isDated = false;
        let keywords = [];
        let values = [];
        let lenght = "";
        let sapwood = null;
        let dateEnd = null;
        for (let attribute of wood) {
          switch (attribute[0]) {
            case ".":
              name = attribute[1];

              break;
            case "LON":
              lenght = attribute[1];
              break;
            case "CAM":
              isCambium = true;
              break;
            case "PIT":
              isPith = true;
              break;
            case ";":
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
                lenght: lenght,
                sapwood: sapwood,
                dateEnd: dateEnd,
              });

              break;
            default:
              if (!isNaN(Number(attribute[0]))) {
                values.push(attribute);
              }
          }
        }
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
          case "LGT":
            site.longitude = attribute[1];
            break;
          case "LAT":
            site.latitude = attribute[1];
            break;
          case "ALT":
            site.elevation = attribute[1];
            break;
        }
      }

      callback([site, resWood, text.split(";")]);
    } catch (err) {
      console.error(err);
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
