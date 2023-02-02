import '../styles/normalize.css';
import '../styles/main.css';

init();

function init(){
    console.log("hola!!");
    console.log(process.env.S3_API || "default");
}
