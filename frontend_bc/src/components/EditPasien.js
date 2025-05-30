import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../utils";

const EditPasien = () => {
  const [nama, setNama] = useState("");
  const [tgl_lahir, setTgl_lahir] = useState("");
  const [gender, setGender] = useState("");
  const [no_telp, setTelp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [id_dokter, setIDDokter] = useState("");
  const [list_dokter, setListDokter] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  

  useEffect(() => {
    getPasienById();
    fetchDokter();
  }, []);

  const fetchDokter = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMsg("Silakan login terlebih dahulu.");
        return;
      }
      const res = await API.get("/doctor",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(res.data) // tambahkan ini
      setListDokter(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPasienById = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMsg("Silakan login terlebih dahulu.");
        return;
      }
      const response = await API.get(`/pasien/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setNama(response.data.nama);
      setTgl_lahir(response.data.tgl_lahir);
      setGender(response.data.gender);
      setTelp(response.data.no_telp);
      setAlamat(response.data.alamat);
      setIDDokter(response.data.id_dokter); 
    } catch (error) {
      console.log(error);
    }
  };

  const updatePasien = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMsg("Silakan login terlebih dahulu.");
        return;
      }
      await API.put(`/pasien/${id}`, {
        
        nama,
        tgl_lahir,
        gender,
        no_telp,
        alamat,
        id_dokter, 
      },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
      navigate("/pasien");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <div className="box p-5">
          <h1 className="title has-text-centered">Edit Data Pasien</h1>
          <form onSubmit={updatePasien}>
            <div className="field">
              <label className="label">Nama</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Pasien"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Tanggal Lahir</label>
              <div className="control">
                <input
                  type="date"
                  className="input"
                  value={tgl_lahir}
                  onChange={(e) => setTgl_lahir(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Jenis Kelamin</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">No. Telepon</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={no_telp}
                  onChange={(e) => setTelp(e.target.value)}
                  placeholder="Nomor Telepon"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Alamat</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Alamat Pasien"
                ></textarea>
              </div>
            </div>

            <div className="field">
              <label className="label">Dokter</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={id_dokter}
                    onChange={(e) => setIDDokter(e.target.value)}
                  >
                    <option value="">Pilih Dokter</option>
                    {list_dokter.map((dokter) => (
                      <option key={dokter.id_dokter} value={dokter.id_dokter}>
                        {dokter.nama_dokter} - {dokter.spesialis}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Update Pasien
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPasien;
