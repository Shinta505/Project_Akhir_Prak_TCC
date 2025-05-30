import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../utils";


const PeriksaPasien = () => {
  const [tanggal_periksa, setTanggalPeriksa] = useState("");
  const [biaya_periksa, setBiayaPeriksa] = useState("");
  const [obatId, setObatId] = useState("");
  const [listObat, setListObat] = useState([]);
  const [pasien, setPasien] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [msg, setMsg] = useState("");  

  useEffect(() => {
    fetchPasien();
    fetchObat();
  }, []);

  const fetchPasien = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMsg("Silakan login terlebih dahulu.");
        return;
      }
      const res = await API.get(`/pasien/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setPasien(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchObat = async () => {
    const token = localStorage.getItem("accessToken");
      if (!token) {
        setMsg("Silakan login terlebih dahulu.");
        return;
      }
    const res = await API.get("/obat",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    setListObat(res.data);
  };

  const savePeriksa = async (e) => {
    e.preventDefault();

    // Validasi
    if (!tanggal_periksa || !biaya_periksa || !obatId) {
      alert("Semua field harus diisi!");
      return;
    }
    const biayaPeriksa = parseFloat(biaya_periksa);
    if (isNaN(biayaPeriksa)) {
      alert("Biaya periksa harus berupa angka!");
      return;
    }
  

    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.post("/add-periksa", {
        tanggal_periksa,
        biaya_periksa,
        pasienId: id,
        obatId,
      });
      
      // Ambil ID struk dari response dan arahkan ke halaman struk
      const id_struk = res.data.id_struk;  
      navigate(`/pasien/periksa/struk/${id_struk}`);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <div className="box p-5">
          <h1 className="title has-text-centered">Tambah Pemeriksaan</h1>
          <form onSubmit={savePeriksa}>
            <div className="field">
              <label className="label">Pasien</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={pasien?.nama || ""}  // Safe value with default ""
                  disabled
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Tanggal Periksa</label>
              <div className="control">
                <input
                  type="datetime-local"
                  className="input"
                  value={tanggal_periksa}
                  onChange={(e) => setTanggalPeriksa(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Biaya Periksa</label>
              <div className="control">
                <input
                  type="number"  // Use number input type for biaya
                  className="input"
                  value={biaya_periksa}
                  onChange={(e) => setBiayaPeriksa(Number(e.target.value))}
                  placeholder="Masukkan biaya periksa"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Obat</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={obatId}
                    onChange={(e) => setObatId(e.target.value)}
                    required
                  >
                    <option value="">Pilih Obat</option>
                    {listObat.map((obat) => (
                      <option key={obat.id_obat} value={obat.id_obat}>
                        {obat.nama_obat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field has-text-centered">
              <button type="submit" className="button is-success is-fullwidth">
                Simpan Pemeriksaan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PeriksaPasien;
