import React, { useEffect, useState } from 'react'
import { Typography, Table, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons'
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'
import { useNavigate, useParams } from 'react-router-dom';
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
const { Text } = Typography;
export default function Ticket() {
    const params = useParams()
    const navigate = useNavigate()
    const [bookedUser, setBookeduser] = useState()
    const [bookedTrainSeat, setBookedTrainSeat] = useState()
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        location: "",
        date: "",
    });
    const columns = [
        {
            title: 'Passenger',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: 'Quota',
            dataIndex: 'quota',
            key: 'quota',
        },
    ];
    const data = [
        {
            name: bookedUser?.name,
            class: bookedUser?.seat?.split(" ")[0],
            quota: "GN",
        }
    ];

    const htmltoImage = () => {
        const domElement = document.getElementsByClassName("comments-result");
        const arr = [...domElement];
        const generateImage = async (domElement) => {
            const canvas = await html2canvas(domElement, {
                onclone: (document_1) => {
                    document_1.getElementById("innerDiv").style.display = "block";
                },
                windowWidth: 1600,
            });
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            return imgData;
        };
        return Promise.all(arr.map((element) => generateImage(element)));
    };
    let cashfree;
    let insitialzeSDK = async function () {

        cashfree = await load({
            mode: "sandbox",
        })
    }

    insitialzeSDK()
    const [orderId, setOrderId] = useState("")

    const getSessionId = async () => {
        try {
            let res = await axios.get("http://localhost:5000/payment")

            if (res.data && res.data.payment_session_id) {

                console.log(res.data)
                setOrderId(res.data.order_id)
                return res.data.payment_session_id
            }


        } catch (error) {
            console.log(error)
        }
    }

    const verifyPayment = async () => {
        try {

            let res = await axios.post("http://localhost:5000/verify", {
                orderId: orderId
            })

            if (res && res.data) {

                alert("payment verified")
            }

        } catch (error) {
            console.log(error)
        }
    }
    const handleClick = async (e) => {
        e.preventDefault();

        try {
            let sessionId = await getSessionId()
            let checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: "_modal",
            }

            cashfree.checkout(checkoutOptions).then(async (res) => {
                console.log("payment initialized")
                let arr1 = bookedTrainSeat.seats
                let arr2 = bookedTrainSeat?.seats?.filter(item => item.class === bookedUser?.seat?.split(" ")[0]);
                arr2[0].avail = arr2[0].avail - 1;
                let arr3 = arr1.map(obj => arr2.find(o => o.class === obj.class) || obj);
                await axios.put(`http://localhost:5000/train/updatetrainseats/${bookedTrainSeat._id}`,
                    {
                        name: bookedTrainSeat.name,
                        code: bookedTrainSeat.code,
                        arriving: bookedTrainSeat.arriving,
                        departure: bookedTrainSeat.departure,
                        quota: bookedTrainSeat.quota,
                        start: bookedTrainSeat.start,
                        destination: bookedTrainSeat.destination,
                        seats: arr3,
                        bookedSeats: bookedTrainSeat.bookedSeats + 1,
                        availability: bookedTrainSeat.availability,
                        classes: bookedTrainSeat.classes
                    }
                );
                htmltoImage().then(() => {
                    import("./pdfGenerator")
                        .then(async (module) => {
                            const PdfFile = module.default;
                            const doc = <PdfFile title="Personal Doc" data={formData} />;
                            const blob = await pdf(doc).toBlob();
                            blob.originalname = "pdfdocs.pdf";
                            saveAs(blob, "pdfdoc.pdf");
                        })
                        .catch((error) => console.log("error====>", error));
                });
                navigate("/filter-train")
                verifyPayment(orderId)
            })




        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        async function fetchBookedUser() {
            const data = await axios.get(`http://localhost:5000/user//bookingid/${params.id}`)
            setBookeduser(data.data)
        }
        fetchBookedUser();
    }, [])
    useEffect(() => {
        if (bookedUser?.code) {
            async function fetchTrain() {
                const response = await axios.get(`http://localhost:5000/train/getbytraincode/${bookedUser?.code}`)
                console.log('responses', response.data);
                setBookedTrainSeat(response.data)
            }
            fetchTrain()
        }
    }, [bookedUser])
    console.log('bookedtrain', bookedTrainSeat);


    return (
        <div className='parent-div1'>
            <div className='id-div1'>
                <div>
                    <Text strong >Ticket Summary</Text>
                    <Text>{bookedUser?.train} - {bookedUser?.code}</Text>
                    <Text>{bookedUser?.source} <ArrowRightOutlined /> {bookedUser?.destination}</Text>
                </div>
                <div>
                    <Text>Available</Text>
                    <Text type='success'>GNWL178/WL52</Text>
                    <Text>Boarding Date: Fri, 13 Dec</Text>
                </div>

            </div>
            <div className='id-div2'>
                <Text>Journey Date: Fri, 13 Dec</Text>
            </div>
            <div className='id-div2'>
                <Table style={{ width: 600 }} columns={columns} dataSource={data} />
            </div>
            <div className='id-div2'>
                <Text strong>Pay Amount</Text>
                <Text strong>₹{bookedUser?.seat?.split(" ")[1]}</Text>
            </div>
            <div className='id-div2'>
                <Button type='primary' onClick={handleClick} block>Proceed to pay</Button>
            </div>
        </div>
    )
}
