const app = require('./src/app');
require("dotenv").config();


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Changes")

    console.log("backend server listening on port", PORT)

});
