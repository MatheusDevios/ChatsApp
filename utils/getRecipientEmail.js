const getRecipientEmail = (users, userLoggedIn) => {
  //filter the user email which is different from the current user logged in
  return users?.filter((user) => user !== userLoggedIn?.email)[0];
};

export default getRecipientEmail;
