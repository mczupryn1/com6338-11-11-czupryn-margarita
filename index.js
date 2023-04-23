const getPoemBtn = document.getElementById('get-poem');
const poemEl = document.getElementById('poem');
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json';

const getJSON = url => fetch(url).then(res => res.json());

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg);

const makeTag = tag => str => `<${tag}>${str}</${tag}>`;

const makePoemHTML = (data) => {
  let output = '';
  const [{ author, lines, title }] = data;

  // create the title and author sections
  output +=
    makeTag('h2')(title) +
    pipe(makeTag(`em`), makeTag(`h3`))(`by ` + author);

  // create line breaks for each line
  const joinLines = arr => arr.join('<br/>');
  const splitLines = str => str.split('<br/><br/>');

  // split stanzas into paragraphs
  const makeParagraphText = pipe(joinLines, splitLines);
  const makeParagraph = makeTag(`p`);

  // turn poem into a string of HTML
  const paraArray = makeParagraphText(lines).map(str => makeParagraph(str));
  const poemString = paraArray.join('');

  output += poemString;

  return output;
}

// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  // Render the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL));
}