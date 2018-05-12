require("./style.scss");
import Switch from "./switch/switch.js";
const uuidv4 = require("uuid/v4");

// random int gen helper fn
const random = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

// log positions for collision
const positions = [];

// check if mobile
const mobile = () =>
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    (navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)
  );

// set margins per device
const margin = mobile() ? {'a': 60, 'b': 125} : {'a': 90, 'b': 150};

const behavior = s => {
  if (s.mood) {
    clearInterval(s.mood);
    s.mood = null;
  }
  const state = random(0, 50);
  if (state < 33)
    s.mood = setInterval(() => s.switch.toggle(), random(10000, 20000));
  else if (state < 49)
    s.mood = setInterval(() => s.switch.toggle(), random(5000, 10000));
  else s.mood = setInterval(() => s.switch.toggle(), random(500, 1500));
};

const createSwitch = collide => {
  const x = random(margin.a, window.innerWidth - margin.b);
  const y = random(margin.a, window.innerHeight - margin.b);
  let collision = false;
  positions.forEach(el => {
    if (el.x < x + 40 && el.x + 40 > x && el.y < y + 35 && el.y + 35 > y)
      collision = true;
  });
  if (collision && !collide) return;
  positions.push({ x: x, y: y });
  const checkbox = Object.assign(
    document.body.appendChild(document.createElement(`input`)),
    {
      name: `switch`,
      type: `checkbox`
    }
  );
  const s = Object.assign({
    switch: new Switch(checkbox, x, y)
  });
  s.switch.el.addEventListener(`click`, e => {
    e.preventDefault();
    s.switch.toggle();
  });
  behavior(s);
  setInterval(() => behavior(s), random(10000, 20000));
};

const createSwitches = (amt, collide) => {
  if (collide) for (var i = 0; i < amt; i++) createSwitch(true);
  else {
    let last = null;
    let tries = 0;
    const timeout = 0.21 * (window.innerWidth + window.innerHeight) - 211.387;
    while (positions.length <= amt && tries < timeout) {
      console.log('arr: ', positions.length, '\nlast: ', last, '\ntries: ', tries)
      if (positions.length == last) tries++;
      createSwitch(false);
      if (positions.length > last) tries = 0;
      last = positions.length;
    }
  }
};

createSwitches(125, false);

let toggle = false;
document.getElementsByTagName("footer")[0].addEventListener(`click`, e =>
  ((e.target.localName != "a") && (toggle = !toggle)) ? 
  e.target.innerHTML = "<section><div>untitled 2 by greg wolff</div><div><a href=\"https://github.com/greg-wolff/untitled-2\" target=\"_blank\">source</a></div></section><br><br> each series of switches is randomly generated upon the browser canvas and set to change their behavior randomly between 10 and 20 seconds. behavior states include (in order of likeliness):<br>'sleepy' — switching randomly every 10 to 20 seconds,<br>'active' — switching randomly every 5 to 10 seconds, and<br>'agitated' — switching back and forth repeatedly.<br>" :
  !(e.target.localName == "a") && (e.target.innerHTML = "untitled 2 by greg wolff")
)
