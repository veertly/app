// import React from "react";
// import QueryAllMeetups from "../GraphQL/QueryAllMeetups";
// import Meetups from "../Components/Meetups";
// import { useQuery } from "@apollo/react-hooks";

// function MeetupsContainer() {
//   const { loading, error, data } = useQuery(QueryAllMeetups);
//   if (loading) return <p>Loading...</p>;
//   if (error) {
//     console.log(error);
//     return <p>Error :(</p>;
//   }

//   const meetups = data.listMeetups.items;
//   console.log(data);
//   return <Meetups meetups={meetups} />;
// }

// export default MeetupsContainer;
