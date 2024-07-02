import React, { useEffect, useState } from 'react'
import Styles from "./NetworkMonitor.module.css"
import { useSelector } from 'react-redux'
import axios from 'axios';

let requestTypeArr = [
    { heading: "All", value: "all" },
    { heading: "Fetch/XHR", value: "fetch" },
    { heading: "Doc", value: "document" },
    { heading: "CSS", value: "style" },
    { heading: "JS", value: "script" },
    { heading: "Font", value: "font" },
    { heading: "Img", value: "image" },
    { heading: "Media", value: "media" },
    { heading: "Manifest", value: "manifest" },
    { heading: "WS", value: "websocket" },
    { heading: "Wasm", value: "wasm" },
    { heading: "Other", value: "other" }
];

const NetworkMonitor = () => {
    const monitorSelector = useSelector((store) => store.requestDetails)
    const [requestDetailsFilter, setRequestDetailsFilter] = useState([])
    const [selectFilter, setFilter] = useState("all")
    const [link, setLink] = useState("https://jsonplaceholder.typicode.com/albums")

    const makeRequest = async () => {
        try {
            const res = await axios.get(link)
            console.log(res)
        } catch (error) {

        }
    }

    useEffect(() => {
        if (selectFilter === "all") {
            setRequestDetailsFilter(monitorSelector)
        } else {
            const filter = monitorSelector.filter((ele) => {
                return ele.type === selectFilter
            })
            setRequestDetailsFilter(filter)
        }

    }, [selectFilter, monitorSelector])
    console.log(monitorSelector)
    return (
        <div className={Styles.networkContainer}>

            <div className={Styles.topSection}>
                <input type="text" placeholder='Filter' className={Styles.filterInput} />
                <div>
                    <input type="checkbox" name="" id="" />
                    <label> Invert</label>
                </div>
                <div>
                    <input type="checkbox" name="" id="" />
                    <label >Hide data URLs</label>
                </div>
                <div>
                    <input type="checkbox" name="" id="" />
                    <label >Hide extension URLs</label>
                </div>

                <div className={Styles.testInput}>
                    <input type="text" placeholder='Test your api' className={Styles.filterInput} onChange={(e) => setLink(e.target.value)} value={link} />
                    <button onClick={() => makeRequest()}>test api</button>
                </div>
            </div>

            <div className={Styles.allRequestMidpart}>
                <div>
                    {requestTypeArr.map((ele, ind) => {
                        return (
                            <span className={Styles.allrequest} key={ind} style={{ backgroundColor: selectFilter === ele.value ? "rgb(114,114,114)" : "" }} onClick={() => setFilter(ele.value)}>{ele.heading}</span>
                        )
                    })}
                </div>
                <div className={Styles.otherOptions}>
                    <input type="checkbox" />
                    Blocked response cookies
                </div>
                <div className={Styles.otherOptions}>
                    <input type="checkbox" />
                    Blocked requests
                </div>
                <div className={Styles.otherOptions}>
                    <input type="checkbox" />
                    3rd-party request
                </div>
            </div>


            <div className={Styles.hr}> </div>
            {
                requestDetailsFilter.length === 0 ? (<div className={Styles.requestbottompart}>
                    <div className={Styles.requestbottom}>
                        <p>
                            Recording network activity...
                        </p>
                        <p>Perform a request or hit R to record the reload.</p>
                        <a href="#">Learn more</a>
                    </div>
                </div>) : (
                    <div>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <td>Name</td>
                                    <td>Status</td>
                                    <td>Type</td>
                                    <td>Initiator</td>
                                    <td>Size</td>
                                    <td>Time</td>
                                </tr>

                            </thead>
                            <tbody>

                                {
                                    requestDetailsFilter.map((ele, ind) => {
                                        return <tr key={ind}>
                                            <td>{ele.name}</td>
                                            <td>{ele.status}</td>
                                            <td>{ele.type}</td>
                                            <td>{ele.url}</td>
                                            <td>{Math.round(ele.size / 1024)} Kb</td>
                                            <td>{Math.round(ele.duration)} ms</td>
                                        </tr>
                                    })
                                }

                            </tbody>
                        </table>
                    </div>
                )
            }


        </div>
    )
}

export default NetworkMonitor