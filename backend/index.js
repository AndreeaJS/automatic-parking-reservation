import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
//import userRoutes from "./routes/users.js";
import lotRoutes from "./routes/lots.js";
import cookieParser from "cookie-parser";
import { db } from "./db.js";

const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.use("/backend/auth", authRoutes);
//app.use("/backend/users", userRoutes);
app.use("/backend/lots", lotRoutes);

app.get("/", (req, res) => {
    res.json("Conectat la server!");
})

app.get("/backend/auth", (req, res) => {
    res.json("Auth page");
})

app.get("/backend/lotstud", (req, res) => {
    db.query("SELECT * FROM lotS", (err, result) => {
      if (err) {
        console.error("Eroare la preluarea datelor despre parcare:", err);
        res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
      } else {
        res.json(result);
      }
    });
});

app.get("/backend/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
      if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
      } else {
      res.json(result);
      }
  });
});

app.get("/backend/users/:idUser", (req, res) => {
  const idUser = req.params.idUser;

  db.query("SELECT * FROM users WHERE idUser = ?", [idUser], (err, result) => {
      if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
      } else {
      res.json(result);
      }
  });
});

app.get("/backend/lotprof", (req, res) => {
    db.query("SELECT * FROM lotP", (err, result) => {
        if (err) {
        console.error("Eroare la preluarea datelor despre parcare:", err);
        res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
        } else {
        res.json(result);
        }
    });
});

app.get("/backend/reservationsP", (req, res) => {
  db.query("SELECT * FROM reservationsP", (err, result) => {
      if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
      } else {
      res.json(result);
      }
  });
});


app.get("/backend/reservationsS", (req, res) => {
  db.query("SELECT * FROM reservationsS", (err, result) => {
      if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
      } else {
      res.json(result);
      }
  });
});


app.post("/backend/reservationsP", (req, res) => {
  const { selectedDate, selectedOption, currentUser } = req.body;

  // Verificarea existenței rezervărilor pentru data și zona selectate
  db.query(
    "SELECT * FROM reservationsP WHERE dateReservation = ?",
    [selectedDate],
    (err, reservations) => {
      if (err) {
        console.error("Eroare la preluarea rezervărilor:", err);
        res.status(500).json({ error: "Eroare la preluarea rezervărilor" });
      } else {
        if (reservations.length > 0) {
          console.log("Există rezervări pentru aceeași dată");
          res.status(400).json({ error: "Există rezervări pentru aceeași dată" });
        } else {
          // Nu există rezervări pentru data selectată

          // Găsește primul idLotP disponibil pentru zona selectată
          db.query(
            "SELECT * FROM lotP LEFT JOIN reservationsP ON lotP.idLotP = reservationsP.idLotP WHERE reservationsP.idReservationP IS NULL AND lotP.zona = ? LIMIT 1",
            [selectedOption],
            (err, availableLot) => {
              if (err) {
                console.error("Eroare la preluarea loturilor disponibile:", err);
                res.status(500).json({ error: "Eroare la preluarea loturilor disponibile" });
              } else {
                if (availableLot.length > 0) {
                  // Există un lotP disponibil

                  const formattedDate = selectedDate
                  const newReservation = {
                    idUser: currentUser.idUser,
                    idLotP: availableLot[0].idLotP,
                    dateReservation: formattedDate,
                  };

                  // Realizează rezervarea
                  db.query(
                    "INSERT INTO reservationsP SET ?",
                    newReservation,
                    (err, result) => {
                      if (err) {
                        console.error("Eroare la realizarea rezervării:", err);
                        res.status(500).json({ error: "Eroare la realizarea rezervării" });
                      } else {
                        res.json({ success: true });
                      }
                    }
                  );
                } else {
                  console.log("Nu există loturi disponibile pentru rezervare");
                  res.status(400).json({ error: "Nu există loturi disponibile pentru rezervare" });
                }
              }
            }
          );
        }
      }
    }
  );
});

app.post("/backend/reservationsS", (req, res) => {
  const { selectedDate, selectedOption, currentUser } = req.body;

  // Verificarea existenței rezervărilor pentru data și zona selectate pentru studenți
  db.query(
    "SELECT * FROM reservationsS WHERE dateReservation = ?",
    [selectedDate],
    (err, reservations) => {
      if (err) {
        console.error("Eroare la preluarea rezervărilor:", err);
        res.status(500).json({ error: "Eroare la preluarea rezervărilor" });
      } else {
        if (reservations.length > 0) {
          console.log("Există rezervări pentru aceeași dată");
          res.status(400).json({ error: "Există rezervări pentru aceeași dată" });
        } else {
          // Nu există rezervări pentru data selectată

          // Găsește primul idLotS disponibil
          db.query(
            "SELECT * FROM lotS LEFT JOIN reservationsS ON lotS.idLotS = reservationsS.idLotS WHERE reservationsS.idReservationS IS NULL LIMIT 1",
            (err, availableLot) => {
              if (err) {
                console.error("Eroare la preluarea loturilor disponibile:", err);
                res.status(500).json({ error: "Eroare la preluarea loturilor disponibile" });
              } else {
                if (availableLot.length > 0) {
                  
                  // Există un lotS disponibil

                  const formattedDate = selectedDate
                  const newReservation = {
                    idUser: currentUser.idUser,
                    idLotS: availableLot[0].idLotS,
                    dateReservation: formattedDate,
                  };

                  // Realizează rezervarea
                  db.query(
                    "INSERT INTO reservationsS SET ?",
                    newReservation,
                    (err, result) => {
                      if (err) {
                        console.error("Eroare la realizarea rezervării:", err);
                        res.status(500).json({ error: "Eroare la realizarea rezervării" });
                      } else {
                        res.json({ success: true });
                      }
                    }
                  );
                } else {
                  console.log("Nu există loturi disponibile pentru rezervare");
                  res.status(400).json({ error: "Nu există loturi disponibile pentru rezervare" });
                }
              }
            }
          );
        }
      }
    }
  );
});

app.get('/backend/reservationsP/:idUser', (req, res) => {
  const idUser = req.params.idUser;
  db.query('SELECT * FROM reservationsP WHERE idUser = ?', idUser, (err, result) => {
    if (err) {
      console.error('Eroare la preluarea datelor despre rezervări:', err);
      res.status(500).json({ error: 'Eroare la preluarea datelor despre rezervări' });
    } else {
      res.json(result);
    }
  });
});

app.get('/backend/reservationsS/:idUser', (req, res) => {
  const idUser = req.params.idUser;
  db.query('SELECT * FROM reservationsS WHERE idUser = ?', idUser, (err, result) => {
    if (err) {
      console.error('Eroare la preluarea datelor despre rezervări:', err);
      res.status(500).json({ error: 'Eroare la preluarea datelor despre rezervări' });
    } else {
      res.json(result);
    }
  });
});

app.get("/backend/reservationsS/lotstud/:idlotS", (req, res) => {
  const idlotS = req.params.idlotS;
  db.query("SELECT dateReservation FROM reservationsS WHERE idLotS = ?", idlotS, (err, result) => {
    if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
    } else {
      if (result.length > 0) {
        //const dateReservation = result[0].dateReservation;
        const dateReservationUTC = result[0].dateReservation;
        const dateReservation = new Date(dateReservationUTC.getTime() - (dateReservationUTC.getTimezoneOffset() * 60000));
        res.json({ dateReservation });
      } else {
        res.json({ dateReservation: null });
      }
    }
  });
});

app.get("/backend/reservationsP/lotprof/:idlotP", (req, res) => {
  const idlotP = req.params.idlotP;
  db.query("SELECT dateReservation FROM reservationsP WHERE idLotP = ?", idlotP, (err, result) => {
    if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
    } else {
      if (result.length > 0) {
        const dateReservationUTC = result[0].dateReservation;
        const dateReservation = new Date(dateReservationUTC.getTime() - (dateReservationUTC.getTimezoneOffset() * 60000));
        res.json({ dateReservation });
      } else {
        res.json({ dateReservation: null });
      }
    }
  });
});

app.get("/backend/reservationsS/:idUser/lotstud/:idlotS", (req, res) => {
  const idUser = req.params.idUser;
  const idLotS = req.params.idlotS;
  
  db.query("SELECT * FROM reservationsS WHERE idUser = ? AND idLotS = ?", [idUser, idLotS], (err, result) => {
    if (err) {
      console.error('Eroare la preluarea datelor despre loc:', err);
      res.status(500).json({ error: 'Eroare la preluarea datelor despre loc.' });
    } else {
      res.json(result);
    }
  });
});

app.get("/backend/reservationsP/:idUser/lotprof/:idlotP", (req, res) => {
  const idUser = req.params.idUser;
  const idLotP = req.params.idlotP;
  
  db.query("SELECT * FROM reservationsP WHERE idUser = ? AND idLotP = ?", [idUser, idLotP], (err, result) => {
    if (err) {
      console.error('Eroare la preluarea datelor despre loc:', err);
      res.status(500).json({ error: 'Eroare la preluarea datelor despre loc.' });
    } else {
      res.json(result);
    }
  });
});

app.delete("/backend/reservationsS/:idUser/lotstud/:idlotS", (req, res) => {
  const idUser = req.params.idUser;
  const idLotS = req.params.idlotS;
  
  db.query("DELETE FROM reservationsS WHERE idUser = ? AND idLotS = ?", [idUser, idLotS], (err, result) => {
    if (err) {
      console.error("Eroare la ștergerea rezervării:", err);
      res.status(500).json({ error: "Eroare la ștergerea rezervării" });
    } else {
      res.json({ message: "Rezervarea a fost ștearsă cu succes" });
    }
  });
});


app.delete("/backend/reservationsP/:idUser/lotprof/:idlotP", (req, res) => {
  const idUser = req.params.idUser;
  const idLotP = req.params.idlotP;
  
  db.query("DELETE FROM reservationsP WHERE idUser = ? AND idLotP = ?", [idUser, idLotP], (err, result) => {
    if (err) {
      console.error("Eroare la ștergerea rezervării:", err);
      res.status(500).json({ error: "Eroare la ștergerea rezervării" });
    } else {
      res.json({ message: "Rezervarea a fost ștearsă cu succes" });
    }
  });
});

app.delete("/backend/users/:idUser", (req, res) => {
  const idUser = req.params.idUser;

  db.query("DELETE FROM users WHERE idUser = ?", [idUser], (err, result) => {
      if (err) {
      console.error("Eroare la preluarea datelor despre parcare:", err);
      res.status(500).json({ error: "Eroare la preluarea datelor despre parcare" });
      } else {
      res.json({message: "Contul a fost șters cu succes"});
      }
  });
});


app.listen(8800, () => {
    console.log('Server up and running..')
})