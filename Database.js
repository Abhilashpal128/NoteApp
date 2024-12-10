import SQLite from 'react-native-sqlite-storage';
import {decryptData, encryptData} from './EncryptionStorage/EncryptionStorage';

const database_name = 'Users.db';
const database_version = '1.0';
const database_displayname = 'SQLite User Database';
const database_size = 200000;

let db;

const openDatabase = () => {
  db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.error('Error opening database: ', error);
    },
  );

  // Check if the database is initialized
  if (!db) {
    console.error('Database instance is null');
  }

  db.transaction(txn => {
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT);',
      [],
      () => {
        console.log('Users table created successfully');
      },
      error => {
        console.error('Error creating table: ', error);
      },
    );
  });

  db.transaction(txn => {
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT UNIQUE, poster_path TEXT UNIQUE, overview TEXT, backdrop_path TEXT, relese_date TEXT, vote_average TEXT, vote_count TEXT);',
      [],
      () => {
        console.log('MOVIES table created successfully');
      },
      error => {
        console.error('Error creating table: ', error);
      },
    );
  });

  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        description TEXT, 
        category TEXT, 
        userid INTEGER, 
        image TEXT, 
        latitude TEXT, 
        longitude TEXT, 
        FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
      );`,
      [],
      () => {
        console.log('Notes table created successfully');
      },
      error => {
        console.error('Error creating notes table: ', error);
      },
    );
  });
};

const insertUser = (userName, email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?);',
        [userName, email, password],
        (_, result) => resolve(result),
        (_, error) => reject(error),
      );
    });
  });
};

const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?;',
        [email, password],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0));
          } else {
            reject('User not found');
          }
        },
        (_, error) => reject(error),
      );
    });
  });
};
const insertNote = (
  title,
  description,
  category,
  userId,
  image,
  latitude,
  longitude,
) => {
  console.log('Note Parameters', {
    title,
    description,
    category,
    userId,
    image,
    latitude,
    longitude,
  });

  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('Database instance is null or undefined');
      reject(new Error('Database not initialized'));
      return;
    }

    db.transaction(txn => {
      console.log('Transaction started');
      txn.executeSql(
        'INSERT INTO notes (title, description, category, userid, image, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [title, description, category, userId, image, latitude, longitude],
        (_, result) => {
          console.log('Insert successful, note ID:', result.insertId);
          resolve(result.insertId);
        },
        (_, error) => {
          console.error('Error inserting note:', error);
          reject(error);
        },
      );
    });
  });
};

const getNotesByUser = (userId, category = null) => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      // Define the query with a condition for category if provided
      let query = 'SELECT * FROM notes WHERE userid = ?';
      let params = [userId];

      if (category !== null) {
        query += ' AND category = ?';
        params.push(category);
      }

      txn.executeSql(
        query,
        params,
        (_, result) => {
          if (result.rows.length > 0) {
            let notes = [];
            for (let i = 0; i < result.rows.length; i++) {
              notes.push(result.rows.item(i));
            }
            resolve(notes);
          } else {
            reject('No notes found for this user or category');
          }
        },
        (_, error) => reject(error),
      );
    });
  });
};
const emptyTables = () => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM users;',
        [],
        () => {
          console.log('Users table emptied successfully');
          txn.executeSql(
            'DELETE FROM notes;',
            [],
            () => {
              console.log('Notes table emptied successfully');
              resolve('Tables emptied successfully');
            },
            error => {
              console.error('Error emptying notes table: ', error);
              reject(error);
            },
          );
        },
        error => {
          console.error('Error emptying users table: ', error);
          reject(error);
        },
      );
    });
  });
};
const dropNotesTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'DROP TABLE IF EXISTS movies;',
        [],
        () => {
          console.log('Notes table dropped successfully');
          resolve('Notes table dropped successfully');
        },
        error => {
          console.error('Error dropping notes table: ', error);
          reject(error);
        },
      );
    });
  });
};

// const insertMovies = async movies => {
//   db.transaction(
//     tx => {
//       movies.forEach(async movie => {
//         const {
//           id,
//           title,
//           overview,
//           release_date,
//           backdrop_path,
//           vote_average,
//           poster_path,
//           vote_count,
//         } = movie;
//         const encryptedTitle = await encryptData(`title-${id}`, title);
//         const encryptedOverview = await encryptData(`overview-${id}`, overview);
//         const encryptedReleaseDate = await encryptData(
//           `release_date-${id}`,
//           release_date,
//         );
//         const encryptedPosterPath = await encryptData(
//           `poster_path-${id}`,
//           poster_path,
//         );
//         const encryptedbackdrop = await encryptData(
//           `poster_path-${id}`,
//           backdrop_path,
//         );
//         const encryptedVoteaverage = await encryptData(
//           `poster_path-${id}`,
//           vote_average?.toString(),
//         );
//         const encryptedVoteCount = await encryptData(
//           `poster_path-${id}`,
//           vote_count?.toString(),
//         );
//         console.log(`encrypted Title`, encryptedTitle);

//         tx.executeSql(
//           `INSERT INTO movies (title, overview, release_date, backdrop_path, vote_average, poster_path, vote_count)
//          VALUES (?, ?, ?, ?, ?, ?, ?);`,
//           [
//             encryptedTitle,
//             encryptedOverview,
//             encryptedReleaseDate,
//             encryptedbackdrop,
//             encryptedVoteaverage,
//             encryptedPosterPath,
//             encryptedVoteCount,
//           ],
//           () => {
//             console.log(`encrypted Title`, encryptedTitle);
//             console.log(`Movie inserted successfully: ${title}`);
//           },
//           error => {
//             console.error('Error inserting movie:', error);
//           },
//         );
//       });
//     },
//     error => {
//       console.error('Transaction error:', error);
//     },
//     () => {
//       console.log('All movies inserted successfully');
//     },
//   );
// };

const insertMovies = async movies => {
  try {
    const encryptedMovies = await Promise.all(
      movies.map(async movie => {
        const {
          id,
          title,
          overview,
          release_date,
          backdrop_path,
          vote_average,
          poster_path,
          vote_count,
        } = movie;

        const encryptedTitle = await encryptData(`title-${id}`, title);
        const encryptedOverview = await encryptData(`overview-${id}`, overview);
        const encryptedReleaseDate = await encryptData(
          `release_date-${id}`,
          release_date,
        );
        const encryptedPosterPath = await encryptData(
          `poster_path-${id}`,
          poster_path,
        );
        const encryptedbackdrop = await encryptData(
          `backdrop_path-${id}`,
          backdrop_path,
        );
        const encryptedVoteaverage = await encryptData(
          `vote_average-${id}`,
          vote_average?.toString(),
        );
        const encryptedVoteCount = await encryptData(
          `vote_count-${id}`,
          vote_count?.toString(),
        );

        return {
          id,
          encryptedTitle,
          encryptedOverview,
          encryptedReleaseDate,
          encryptedPosterPath,
          encryptedbackdrop,
          encryptedVoteaverage,
          encryptedVoteCount,
        };
      }),
    );

    db.transaction(
      tx => {
        encryptedMovies.forEach(movie => {
          const {
            id,
            encryptedTitle,
            encryptedOverview,
            encryptedReleaseDate,
            encryptedPosterPath,
            encryptedbackdrop,
            encryptedVoteaverage,
            encryptedVoteCount,
          } = movie;

          tx.executeSql(
            `INSERT INTO movies (id, title, overview, relese_date, backdrop_path, vote_average, poster_path, vote_count) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              id,
              encryptedTitle,
              encryptedOverview,
              encryptedReleaseDate,
              encryptedbackdrop,
              encryptedVoteaverage,
              encryptedPosterPath,
              encryptedVoteCount,
            ],
            () => {
              console.log(`Movie inserted successfully: ${encryptedTitle}`);
            },
            error => {
              console.error('Error inserting movie:', error);
            },
          );
        });
      },
      error => {
        console.error('Transaction error:', error);
      },
      () => {
        console.log('All movies inserted successfully');
      },
    );
  } catch (error) {
    console.error('Error in encrypting or inserting movies:', error);
  }
};

const fetchMovies = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM movies;`,
        [],
        async (tx, results) => {
          const movies = [];
          for (let i = 0; i < results.rows.length; i++) {
            const movie = results.rows.item(i);
            movie.title = await decryptData(`title-${movie.id}`);
            movie.overview = await decryptData(`overview-${movie.id}`);
            movie.release_date = await decryptData(`release_date-${movie.id}`);
            movie.poster_path = await decryptData(`poster_path-${movie.id}`);
            movie.backdrop_path = await decryptData(
              `backdrop_path-${movie.id}`,
            );
            movie.vote_average = await decryptData(`vote_average-${movie.id}`);
            movie.vote_count = await decryptData(`vote_count-${movie.id}`);
            movies.push(movie);
          }
          console.log('Movies fetched and decrypted:', movies);
          resolve(movies); // Resolve the promise with the movies array
        },
        error => {
          console.error('Error fetching movies:', error);
          reject(error); // Reject the promise on error
        },
      );
    });
  });
};
// const fetchMovies = async () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         `SELECT * FROM movies;`,
//         [],
//         async (tx, results) => {
//           const movies = [];
//           for (let i = 0; i < results.rows.length; i++) {
//             const movie = results.rows.item(i);

//             // Log the raw encrypted data
//             console.log('Encrypted movie:', movie);

//             try {
//               // Attempt decryption and log each step
//               movie.title = await decryptData(`title-${movie.id}`);
//               console.log('Decrypted title:', movie.title);

//               movie.overview = await decryptData(`overview-${movie.id}`);
//               console.log('Decrypted overview:', movie.overview);

//               movie.release_date = await decryptData(
//                 `release_date-${movie.id}`,
//               );
//               console.log('Decrypted release date:', movie.release_date);

//               movie.poster_path = await decryptData(`poster_path-${movie.id}`);
//               console.log('Decrypted poster path:', movie.poster_path);

//               movie.backdrop_path = await decryptData(
//                 `backdrop_path-${movie.id}`,
//               );
//               console.log('Decrypted backdrop path:', movie.backdrop_path);

//               movie.vote_average = await decryptData(
//                 `vote_average-${movie.id}`,
//               );
//               console.log('Decrypted vote average:', movie.vote_average);

//               movie.vote_count = await decryptData(`vote_count-${movie.id}`);
//               console.log('Decrypted vote count:', movie.vote_count);

//               movies.push(movie);
//             } catch (error) {
//               console.error('Error decrypting movie data:', error);
//             }
//           }
//           console.log('Movies fetched and decrypted:', movies);
//           resolve(movies); // Resolve the promise with the movies array
//         },
//         error => {
//           console.error('Error fetching movies:', error);
//           reject(error); // Reject the promise on error
//         },
//       );
//     });
//   });
// };

export {
  openDatabase,
  insertUser,
  getUser,
  insertNote,
  getNotesByUser,
  emptyTables,
  dropNotesTable,
  insertMovies,
  fetchMovies,
};
