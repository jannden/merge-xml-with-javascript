// Grabbing the DOM elements
const form = document.getElementById("merge");
const documentOne = document.getElementById("xml1");
const documentTwo = document.getElementById("xml2");
const tagToBeMerged = document.getElementById("tag");

// Helper functions
const createXMLHttpRequest = (file) => {
  const request = new XMLHttpRequest();
  request.open("Get", URL.createObjectURL(file));
  request.responseType = "document";
  return request;
};
const serializeXMLToString = (requestResponse) => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(requestResponse);
};

// Merging two XML files into one
form.addEventListener("submit", (e) => {
  e.preventDefault();
  requestOne = createXMLHttpRequest(documentOne.files.item(0));
  requestOne.addEventListener("load", () => {
    requestTwo = createXMLHttpRequest(documentTwo.files.item(0));
    requestTwo.addEventListener("load", () => {
      // Serialize the XML to a string for both documents
      const stringOne = serializeXMLToString(requestOne.response);
      const stringTwo = serializeXMLToString(requestTwo.response);

      // Extract the content of the desired tag from a file
      const whatToExtract = new RegExp(
        `<${tagToBeMerged.value}>([\\s\\S]+?)<\\/${tagToBeMerged.value}>`
      );
      if (!whatToExtract.test(stringTwo)) {
        console.log("The desired tag wasn't found.");
        return;
      }
      const extractedData = stringTwo.match(whatToExtract)[1];

      // Now inject the match to the other file
      const whereToInject = new RegExp(`<\\/${tagToBeMerged.value}>`);
      let combinedString = stringOne.replace(
        whereToInject,
        `${extractedData}</guacamole>`
      );

      // Now create a new XML file and send it to the user
      const blob = new Blob([combinedString], { type: "text/xml" });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = "combined.xml";
      a.click();
    });
    requestTwo.send();
  });
  requestOne.send();
});
