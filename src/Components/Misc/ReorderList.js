import React from "react";
import { Container, Draggable } from "react-smooth-dnd";
import arrayMove from "array-move";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DragHandleIcon from "@material-ui/icons/DragHandle";

const ReorderList = ({ items, setItems, renderItem }) => {
  // const [items, setItems] = useState([
  //   { id: "1", text: "Item 1" },
  //   { id: "2", text: "Item 2" },
  //   { id: "3", text: "Item 3" },
  //   { id: "4", text: "Item 4" }
  // ]);

  const onDrop = ({ removedIndex, addedIndex }) => {
    setItems((items) => arrayMove(items, removedIndex, addedIndex));
  };

  return (
    <List>
      <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
        {items.map((item) => (
          <Draggable key={item.id}>
            <ListItem className="drag-handle">
              {/* <ListItemText primary={text} /> */}
              {renderItem(item)}
              <ListItemSecondaryAction>
                <ListItemIcon className="drag-handle">
                  <DragHandleIcon />
                </ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>
          </Draggable>
        ))}
      </Container>
    </List>
  );
};

export default ReorderList;
