const game_info = {
  board: [],
  lines: 0,
  columns: 0,
  mines: 0,
  targets: 0,
  play: false,
};

const play = document.querySelector('#play')

const create_element = (tag_name, class_name) => {
  const element = document.createElement(tag_name);
  element.className = class_name;
  return element;
};

const create_field = (line, column) => {
  let element = create_element("div", "field disable");
  element.setAttribute("line", line);
  element.setAttribute("column", column);
  let active = false;
  let value = 0;
  return { element, value, active, line, column };
};

const create_board = (lines, columns, mines) => {
  let board = [];
  for (let line = 0; line < lines; line++) {
    let vector = [];

    for (let column = 0; column < columns; column++) {
      vector.push(create_field(line, column));
    }

    board.push(vector);
  }
  game_info.lines = lines;
  game_info.columns = columns;
  game_info.mines = mines;
  game_info.targets = columns * lines - mines;
  game_info.board = board;
};

const random_integer = (max) => Math.floor(Math.random() * max);

const add_mines = (_) => {
  let mines = 0;

  while (mines !== game_info.mines) {
    let line = random_integer(game_info.lines);
    let column = random_integer(game_info.columns);
    const field = game_info.board[line][column];

    if (field.value !== "*") {
      field.value = "*";
      mines++;
    }
  }
};

const get_neighbors = (line, column) => {
  const board = game_info.board;
  const lines = game_info.lines;
  const columns = game_info.columns;
  let neighbors = [];

  if (column - 1 >= 0 && line - 1 >= 0) {
    neighbors.push(board[line - 1][column - 1]);
  }
  if (column - 1 >= 0) {
    neighbors.push(board[line][column - 1]);
  }
  if (column - 1 >= 0 && line + 1 < lines) {
    neighbors.push(board[line + 1][column - 1]);
  }
  if (column + 1 < columns && line - 1 >= 0) {
    neighbors.push(board[line - 1][column + 1]);
  }
  if (column + 1 < columns) {
    neighbors.push(board[line][column + 1]);
  }
  if (column + 1 < columns && line + 1 < lines) {
    neighbors.push(board[line + 1][column + 1]);
  }
  if (line - 1 >= 0) {
    neighbors.push(board[line - 1][column]);
  }
  if (line + 1 < lines) {
    neighbors.push(board[line + 1][column]);
  }
  return neighbors;
};

const add_numbers = (_) => {
  game_info.board.forEach((e) => {
    e.forEach((field) => {
      if (field.value !== "*") {
        let neighbors = get_neighbors(field.line, field.column);
        field.value = neighbors.reduce((acumulator, neighbor) => {
          if (neighbor.value == "*") {
            acumulator++;
          }
          return acumulator;
        }, 0);
      }
    });
  });
};

const activate_field = (line, column) => {
  const field = game_info.board[line][column];

  if (game_info.play && !field.active) {
    field.active = true;
    field.element.className = "field enable";
    field.element.innerHTML = field.value;

    if (field.value === "*") {
      end_game(false);
    } else {
      if (field.value === 0) {
        const neighbors = get_neighbors(field.line, field.column);
        neighbors.forEach((neighbor) =>
          activate_field(neighbor.line, neighbor.column)
        );
      }
      game_info.targets--;
      if (game_info.targets === 0) {
        end_game(true);
      }
    }
  }
};

const get_mines = (_) => {
  const mines = [];

  game_info.board.forEach((e) => {
    e.forEach((field) => {
      if (field.value == "*") {
        mines.push(field);
      }
    });
  });
  return mines;
};

const play_color = () => {
  if (!play.classList.contains('active-button-info')) {
    play.classList.add("active-button-info")
  }  else {
    play.classList.remove("active-button-info")
  }
  console.log("play_color")
}

const end_game = (result) => {
  game_info.play = false;
  if (result) {
    const div_body = document.querySelector("body");
    div_body.classList.add("win");
  } else {
    const mines = get_mines();
    mines
      .map((field) => field.element)
      .forEach(element => {element.className = "field lose"
      element.innerHTML = "*"
    });
  }
  play_color()
};

const div_board = document.querySelector(".board");

const remove_board = () => {
  div_board.innerHTML = ""
  game_info.board = null
}

const init_game = () => {
  remove_board()
  create_board(5, 5, 5);

  add_mines();
  
  add_numbers();
  
  game_info.board.forEach((e) => {
    e.forEach((field) => {
      // field.element.innerHTML = field.value;
      field.element.onclick = (event) => {
        let line = event.target.getAttribute("line");
        let column = event.target.getAttribute("column");
        activate_field(line, column);
      };
    });
  });
  
  const insert_field = (e) => div_board.appendChild(e.element);
  
  game_info.board.forEach((e) => {
    e.forEach(insert_field);
  });
  
}

play.onclick = (e) => {
  if (game_info.play == false) {
    play_color()
    game_info.play = true
    init_game()
  }
}

init_game()