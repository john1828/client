import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    function unsetUser(){
        localStorage.clear();
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
           // console.log(data)
           console.log(typeof data !== undefined)
           if(typeof data !== undefined){
             setUser({
               id: data._id,
               isAdmin: data.isAdmin
             });
           } else {
             setUser({
               id: null,
               isAdmin: null
             });
           }
        })
    }, [])

    useEffect(() => {
    // console.log(user);
    console.log(localStorage);
  }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

 

  