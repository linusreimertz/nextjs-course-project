import moment from "moment"
import {FaImage} from 'react-icons/fa'
import { useState } from "react"
import { useRouter } from "next/router"
import Link from 'next/link'
import Image from 'next/image'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import ImageUpload from "@/components/ImageUpload"
import {API_URL} from '@/config/index'
import styles from '@/styles/Form.module.css'
import { parseCookies } from "@/helpers/index"

const EditEventPage = ({evt, token}) => {
    const [values, setValues] = useState ({
        name: evt.name,
        performers: evt.performers,
        venue: evt.venue,
        address: evt.address,
        date: evt.date,
        time: evt.time,
        description: evt.description
    })
    const [imagePreview, setImagePreview] = useState(evt.image ? evt.image.formats.thumbnail.url : null)

    const [showModal, setShowModal] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(values)

        // Validation
        const hasEmptyFields = Object.values(values).some((element) => element === '')

        if(hasEmptyFields) {
            toast.error('Please fill in all the fields')
        }

        const res = await fetch(`${API_URL}/events/${evt.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })

        if(!res.ok){
            if(res.status === '403' || res.status === '401'){
                toast.error('Unauthorized')

                return
            }
            toast.error('Something Went Wrong')
        }else{
            const evt = await res.json()
            router.push(`/events/${evt.slug}`)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }

    const imageUploaded = async (e) => {
        console.log('image uploaded')
        const res = await fetch(`${API_URL}/events/${evt.id}`)
        const data = await res.json()
        setImagePreview(data.image.formats.thumbnail.url)
        setShowModal(false)
    }

    return (
        <Layout title="Edit Event">
            <Link href='/events'>Go Back</Link>
            <h1>
                Add Event
            </h1>
            <ToastContainer />
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor="name">Event Name</label>
                        <input type="text" id="name" name="name" value={values.name} onChange={handleInputChange}></input>
                    </div>
                    <div>
                        <label htmlFor="performers">Event performers</label>
                        <input type="text" id="performers" name="performers" value={values.performers} onChange={handleInputChange}></input>
                    </div>
                    <div>
                        <label htmlFor="venue">Event venue</label>
                        <input type="text" id="venue" name="venue" value={values.venue} onChange={handleInputChange}></input>
                    </div>
                    <div>
                        <label htmlFor="address">Event address</label>
                        <input type="text" id="address" name="address" value={values.address} onChange={handleInputChange}></input>
                    </div>
                    <div>
                        <label htmlFor="date">Event date</label>
                        <input type="date" id="date" name="date" value={moment(values.date).format('yyyy-MM-DD')} onChange={handleInputChange}></input>
                    </div>
                    <div>
                        <label htmlFor="time">Event time</label>
                        <input type="text" id="time" name="time" value={values.time} onChange={handleInputChange}></input>
                    </div>
                    <div></div>
                </div>
                <div>
                    <label htmlFor="description">Event description</label>
            
                    <textarea type="description" 
                    id="description" 
                    name="description" 
                    value={values.description} 
                    onChange={handleInputChange}>
                    
                    </textarea>
                </div>
                <input type="submit" value="Update Event" className='btn'></input>

            </form>

            <h2>Event Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} />
            ) : <div>
                <p>No image uploaded</p>
            </div> }

            <div>
                <button className='btn-secondary' onClick={() => setShowModal(true)}>
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} token={token}/>
            </Modal>
        </Layout>
    )
}

export default EditEventPage

export async function getServerSideProps({params: {id}, req})
{
    const {token} = parseCookies(req)

    const res = await fetch(`${API_URL}/events/${id}`)
    const evt = await res.json()

    return{
        props: {
            evt,
            token
        }
    }
}

