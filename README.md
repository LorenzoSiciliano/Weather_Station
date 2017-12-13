# Weather Station
## Group N°06
## Authors:
- Brescia Michele
- Loredana Frontino 
- Simone Marca 
- Lorenzo Siciliano

## Work Division

 - **Brescia Michele** : Accordion Animation, error handling image not found, link Google Maps, Readme
 - **Loredana Frontino** : HTML, CSS, Accordion
 - **Simone Marca** : Filters Management
 - **Lorenzo Siciliano** : Update, setInformation, Ajax Call
 ## Functions
- **Accordion animation** : calls the function when an accordion is clicked, check if there is an open accordion and close it when another is clicked, opening and closing animation of the accordion
- **error handling image not found** : if it does not find the image on the server, insert a placeholder in its place 
- **Link Google Maps** : create a link to Google Maps for selected location 
- **Filters Management** : checks the value of the select element and compares it to the weather station's country name,in addition to checking the country, check the text entered in the input filter-station. the function uses the .toggle () method, within this method the two conditions mentioned above are put in place and, if both are true, .toggle () shows the station while if even only one of the 2 conditions is flasa,. toggle () will hide the station
- **Update** : Update the Dom with new information
- **setInformation** : Set the information taken from the API in the DOM
- **Ajax Call** : server call to torinometeo to take the json with all the information. if torinometeo is not accessible, server call to jsonBlob
