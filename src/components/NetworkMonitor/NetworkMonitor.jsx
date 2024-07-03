import React, { useEffect, useState } from 'react'
import Styles from "./NetworkMonitor.module.css"
import { useSelector } from 'react-redux'
import axios from 'axios';
import { JSONTree } from 'react-json-tree';

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
    const [rightSidePannel, setRightSidePannel] = useState(false)
    const [selectFilter, setFilter] = useState("all")
    const [link, setLink] = useState("https://jsonplaceholder.typicode.com/albums")
    const [requestData, setRequestData] = useState({})
    const [selectedSection, setSelectedSection] = useState("Headers")

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

    const handleClick = (e) => {
        setRightSidePannel(true)
        setRequestData(e)
    }
    const handleSelectSection = (e) => {
        setSelectedSection(e)
    }
    const isValidJSON = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    };
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
                    <div className={Styles.requestPanel}>
                        <table className={Styles.table} style={{ width: rightSidePannel ? "20%" : "100%" }}>
                            <thead>
                                <tr style={{ fontSize: "larger" }}>
                                    <td >Name</td>
                                    {
                                        !rightSidePannel && <>
                                            <td>Status</td>
                                            <td>Type</td>
                                            <td>Initiator</td>
                                            <td>Size</td>
                                            <td>Time</td>
                                        </>
                                    }

                                </tr>

                            </thead>
                            <tbody>

                                {
                                    requestDetailsFilter.map((ele, ind) => {
                                        return <tr key={ind} >
                                            <td onClick={() => handleClick(ele)} style={{ cursor: "pointer" }}>{ele.name}</td>
                                            {
                                                !rightSidePannel && <>
                                                    <td>{ele.status}</td>
                                                    <td>{ele.type}</td>
                                                    <td>{ele.url}</td>
                                                    <td>{Math.round(ele.size / 1024)} Kb</td>
                                                    <td>{Math.round(ele.duration)} ms</td>
                                                </>
                                            }

                                        </tr>
                                    })
                                }

                            </tbody>
                        </table>
                        {
                            rightSidePannel && <div className={Styles.responseDetails} >
                                <div className={Styles.responseHeader}>
                                    <span onClick={() => setRightSidePannel(false)}>⨉</span>
                                    {
                                        ["Headers", "Preview", "Response", "Initiator", "Timing"].map((e, ind) => {
                                            return <span key={ind} onClick={() => handleSelectSection(e)} className={selectedSection === e ? Styles.selectedSection : ""}>{e}</span>
                                        })
                                    }
                                </div>
                                <div className={Styles.responseDetailsPage}>
                                    {
                                        selectedSection === "Headers" && <div className={Styles.headers}>
                                            <div>
                                                <span>Request URL</span>
                                                <span>{requestData.url}</span>
                                            </div>
                                            <div>
                                                <span>Request Method</span>
                                                <span>{requestData.method}</span>
                                            </div>
                                            <div>
                                                <span>Status</span>
                                                <span>{requestData.status}</span>
                                            </div>
                                            <div>
                                                <span>duration</span>
                                                <span>{Math.round(requestData.duration)}ms</span>
                                            </div>
                                            <div>
                                                <span>size</span>
                                                <span>{Math.round(requestData.size / 1024)}Kb</span>
                                            </div>
                                            {
                                                requestData.statusText && <div>
                                                    <span>statusText</span>
                                                    <span>{requestData.statusText}</span>
                                                </div>
                                            }

                                            <div>
                                                <span>time</span>
                                                <span>{requestData.time}</span>
                                            </div>
                                            <div>
                                                <span>type</span>
                                                <span>{requestData.type}</span>
                                            </div>
                                        </div>
                                    }
                                    {
                                        selectedSection === "Preview" && <pre>{isValidJSON(requestData.responseText) ? JSON.stringify(JSON.parse(requestData.responseText), null, 2) : "Not a valid json"}</pre>
                                    }
                                    {
                                        selectedSection === "Response" && <pre>{isValidJSON(requestData.responseText) ? JSON.stringify(JSON.parse(requestData.responseText), null, 2) : JSON.stringify(requestData.responseText)}</pre>
                                    }
                                    {
                                        selectedSection === "Initiator" && <div><h1 style={{ color: "gray", textAlign: "center" }}>This request has no initiator data.</h1></div>
                                    }
                                    {
                                        selectedSection === "Timing" && <div style={{ fontSize: "larger", padding: "10px" }}>Request has taken {Math.round(requestData.duration)}ms to complete </div>
                                    }

                                </div>
                            </div>
                        }

                    </div>
                )
            }


        </div>
    )
}

export default NetworkMonitor