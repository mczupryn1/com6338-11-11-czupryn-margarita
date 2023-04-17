const getPoemBtn = document.getElementById('get-poem');
const poemEl = document.getElementById('poem');
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json';

const getJSON = url => fetch(url).then(res => res.json());

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg);

const makeTag = tag => str => `<${tag}>${str}</${tag}>`;

const makePoemHTML = pipe(
  poem => {
    // Convert author name "Rumi" into "<h3><em>by Rumi</em></h3>"
    poem.author = makeTag('em')(poem.author);
    poem.author = makeTag('h3')(poem.author);
    poem.author = poem.author.replace(/^<h3>(.*?)<\/h3>$/, '<h3><em>by $1</em></h3>');
    return poem;
  },
  poem => {
    // Place each stanza (group of lines separated by a blank line) in a single paragraph tag
    poem.lines = poem.lines.join('\n').split(/\n\s*\n/);
    return poem;
  },
  poem => {
    // Place <br> between each line of text inside the paragraph tag
    poem.lines = poem.lines.map(lines => lines.replace(/\n/g, '<br>'));
    return poem;
  },
  poem => {
    // Return HTML string that contains title in h2, then author in em in h3, and then paragraph tags
    const titleHTML = makeTag('h2')(poem.title);
    const authorHTML = poem.author;
    const linesHTML = poem.lines.map(lines => makeTag('p')(lines)).join('');
    return `${titleHTML}\n${authorHTML}\n${linesHTML}`;
  }
);

getPoemBtn.onclick = async function() {
  // Clicking "Get Poem" should render poem HTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL));
}

// Clicking "Get Poem" again should render new poem HTML to #poem
getPoemBtn.addEventListener('click', () => {
  poemEl.innerHTML = '';
});
