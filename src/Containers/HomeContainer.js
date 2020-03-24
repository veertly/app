import React from "react";

// import QueryAllEvents from "../GraphQL/QueryAllEvents";
import Home from "../Components/Home";
// import { useQuery } from "@apollo/react-hooks";
import Layout from "./Layouts/CenteredLayout";
import Typography from "@material-ui/core/Typography";

function HomeContainer() {
  //   const { loading, error, data } = useQuery(QueryAllEvents);
  //   debugger;
  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error :(</p>;

  //   const events = data.listEvents.items;

  return (
    <Layout>
      {/* <Home events={events} /> */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Typography align="center" variant="overline" style={{ display: "block" }}>
        An amazing experience is being incubated!
      </Typography>
    </Layout>
  );
}

export default HomeContainer;
