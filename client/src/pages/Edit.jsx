import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import supabase from '../config/supabase';
import '../assets/css/Style.css';

function Edit () {
    const navigate = useNavigate();
    const [task, setTask] = useState("");
    const [record, setRecord] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        getRecord();
        checkTask();
    },[])

    const checkTask = async () => {
        const {data, error} = await supabase.from('record').select('*').eq('id',id);

        if (error) {
            Swal.fire({
                title:'Error Getting Task',
                text:'There has been error in getting task',
                icon:'error'
            })
        } else {
            setTask(data[0].task);
        }
    }

    const getRecord = async () => {
        const {data, error} = await supabase.from('record').select('*');

        if (error) {
            Swal.fire({
                title:'Error Getting Record',
                text:'There has been error in getting record',
                icon:'error'
            });
        } else {
            setRecord(data);
        }
    }

    const submit = async (e) => {
        e.preventDefault();

        const {data, error} = await supabase.from('record').update({task}).eq('id',id);

        if (error) {
            Swal.fire({
                title:'Error Updating Task',
                text:'There has been error in updating task',
                icon:'error'
            }).then((result) => {
                if (result.isConfirmed) {
                    setTask("");
                    window.location.reload();
                }
            })
        } else {
            Swal.fire({
                title:'Task Updated',
                text:'The task has been updated successfully',
                icon:'success'
            }).then((result) => {
                if (result.isConfirmed) {
                    setTask("");
                    navigate('/');
                }
            })
        }
    }

    const edit = async (id) => {
        navigate(`/Edit/${id}`);
    }

    const del = async (id) => {
        const {data, error} = await supabase.from('record').delete().eq('id',id);

        if (error) {
            Swal.fire({
                title:'Error Deleting Task',
                text:'There has been error in deleting task',
                icon:'error'
            }).then((result) => {
                if (result.isConfirmed) {
                    setTask("");
                    window.location.reload();
                }
            })
        } else {
            Swal.fire({
                title:'Task Deleted',
                text:'The task has been deleted successfully',
                icon:'success'
            }).then((result) => {
                if (result.isConfirmed) {
                    setTask("");
                    window.location.reload();
                }
            })
        }
    }

    return(
        <>
        <br />

        <div style={{display:'flex', justifyContent:'center'}}>
            <div className='div'>
                <form onSubmit={submit}>
                    <div style={{display:'flex'}}>
                        <input type="text" placeholder='Enter a task' value={task} onChange={(e) => setTask(e.target.value)} className='form-control'/>
                        <button className='btn btn-primary' style={{marginLeft:15}}>Update</button>
                    </div>
                </form>
            </div>
        </div>
        <br />

        <div style={{display:'flex', justifyContent: 'center',}}>
            <table className='table'>
                <tr>
                    <th style={{textAlign:'center', fontSize:20, height:50, backgroundColor:'black', color:'white'}}>Task</th>
                    <th style={{textAlign:'center', fontSize:20, height:50, backgroundColor:'black', color:'white'}}>Action</th>
                </tr>

                {record.map((rec) => (
                <tr key={rec.id}>
                    <td style={{textAlign:'center', fontSize:17, height:30}}>{rec.task}</td>
                    <td style={{textAlign:'center', fontSize:17, height:30}}><button className='btn btn-warning' onClick={() => edit(rec.id)}>Edit</button> <button className='btn btn-danger' onClick={() => del(rec.id)}>Delete</button></td>
                </tr>
                ))}

            </table>
        </div>
        </>
    )
}

export default Edit;