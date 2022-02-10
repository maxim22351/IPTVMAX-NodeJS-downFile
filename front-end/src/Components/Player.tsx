import React, {FC,useRef,useEffect} from 'react';
import {ITV} from '../type/type'
import "plyr-react/dist/plyr.css";
import Hls from "hls.js";
import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";

interface PlayerProps{
    nameTV: string | null,
    list: ITV[];
    iconHand: string
}


const Player:FC<PlayerProps> = ({nameTV,list,iconHand}) => {

    const urlObj = list.reduce((accum:Record<string, ITV>, item) => {
        accum[item['name']] = item;
        return accum;
    }, {});

    const ref = useRef<APITypes>(null);
    useEffect(() => {
        const loadVideo = async () => {
            const video = document.getElementById("plyr") as HTMLVideoElement;
            let hls = new Hls();
            // @ts-ignore
            hls.loadSource(urlObj[nameTV].url);
            hls.attachMedia(video);
            // @ts-ignore
            ref.current!.plyr.media = video;

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                (ref.current!.plyr as PlyrInstance).play();
            });
        };
        loadVideo().then(r => console.log(r));
    });



    return (
        (nameTV)?
                (
                    <Plyr
                        id="plyr"
                        options={{ volume: 0.1 }}
                        source={{} as PlyrProps["source"]}
                        ref={ref}
                        style={{width:'100%'}}
                    />
                )
            :
                (
                    <h1 style={{textAlign: 'center'}}> {iconHand} Выберите канал для просмотра</h1>
                )
    );
};

export default Player;