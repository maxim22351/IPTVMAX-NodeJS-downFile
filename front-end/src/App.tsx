import React, {FC, useEffect, useState} from 'react';

import {Grid} from "@mui/material";

import ListTV from "./Components/ListTV";
import Player from "./Components/Player";
import ModalAuth from "./Components/ModalAuth";

import axios from "axios";
import {ITV} from "./type/type";
import {urlAllListLocal, urlGroupListLocal} from './urlBackEnd.json';


const App:FC = () => {


    const [nameTV,setNameTV]= useState<string | null>('');
    const [listTV,setListTV] = useState<ITV[]>([]);
    const [auth,setAuth] = useState<boolean>(true);
    const [modalState,setModalState] = useState<boolean>(false);


    useEffect(()=>{
        getListTV().then(r => console.log(r));

    },[])

    async function getListTV(url= urlAllListLocal) {
        try {

            // const response = await axios.get<ITV>(window.location.origin + '/back-end/');
            const response = await axios.get<ITV[]>('http://localhost:5000/');
            console.log(response.data)
            setListTV(response.data);

        } catch (error) {
            console.error(error);
        }
    }


    function checkName (e:React.MouseEvent<HTMLSpanElement>){

        const event = (e.target as HTMLSpanElement);

        if (event.nodeName === 'SPAN' && auth){
            setNameTV(event.textContent)
        } else {
            setModalState(true)
        }



    }

    // console.log(modalState)

    function filterListGroup(e:React.ChangeEvent<HTMLLIElement>):Promise<void | string> {
        if (e.target.textContent !== ''){
          return getListTV(urlGroupListLocal + e.target.textContent)
        }

        return getListTV()
    }



    return (
        <Grid container spacing={5}>
            <ModalAuth modalState={modalState}/>
            {
                (window.innerWidth <= 900)?
                    (
                       <>
                           <Grid item xs={12} md={9}>
                               <div style={{'margin': '5% 0 0 0'}}>
                                   <Player nameTV={nameTV} list={listTV} iconHand='👇'/>
                               </div>
                           </Grid>
                           <Grid item xs={12} md={3} onClick={checkName}>
                               {(listTV.length > 0)? <ListTV list = {listTV} filterListGroup={filterListGroup}/> : false}
                           </Grid>
                       </>
                    )
                    :
                    (
                        <>
                            <Grid item xs={12} md={3} onClick={checkName}>
                                {(listTV.length > 0)? <ListTV list = {listTV} filterListGroup={filterListGroup}/> : false}
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <div style={{'margin': '5% 0 0 0'}}>
                                    <Player nameTV={nameTV} list={listTV} iconHand='👈'/>
                                </div>
                            </Grid>
                        </>
                    )
            }


        </Grid>
    );
};


export default App;