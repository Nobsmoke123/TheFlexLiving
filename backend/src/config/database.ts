import sqlitePkg from "sqlite3";
import path from "node:path";
import mockProperties from "./../data/mock-property-data.json";
const { verbose } = sqlitePkg;
const sqlite3 = verbose();

const dbPath = path.join(__dirname, "database.db");
export const db = new sqlite3.Database(dbPath);

export const execute = async (
  db: sqlitePkg.Database,
  sql: string,
  params: Array<PropertyKey> = []
) => {
  if (params && params.length > 0) {
    return new Promise<void>((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  return new Promise<void>((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

export const initializeDatabase = async () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      internalListingName TEXT NOT NULL,
      address TEXT NOT NULL,
      description TEXT NOT NULL,
      avg_rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      approved_reviews INTEGER DEFAULT 0,
      price INTEGER NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      guests INTEGER NOT NULL,
      images TEXT --JSON string,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Reviews (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      propertyId TEXT NOT NULL,
      guestName TEXT NOT NULL,
      rating REAL NOT NULL,
      publicReview TEXT,
      reviewCategories TEXT, -- JSON string
      submittedAt DATETIME NOT NULL,
      channel TEXT NOT NULL,
      approved BOOLEAN DEFAULT FALSE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (propertyId) REFERENCES properties (id)
    )`);

    db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM properties",
      (err, row) => {
        if (err) {
          throw err;
        }

        if (row.count === 0) {
          const sampleProperties = mockProperties;
          const stmt = db.prepare(
            `INSERT INTO properties (id, name, internalListingName, address, description, price, bedrooms, bathrooms, guests, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          );
          sampleProperties.forEach((prop) => {
            stmt.run([
              prop.id,
              prop.name,
              prop.internalListingName,
              prop.address,
              prop.description,
              prop.price,
              prop.bathroomsNumber,
              prop.bedroomsNumber,
              prop.personCapacity,
              JSON.stringify(prop.listingImages.map((image) => image.url)),
            ]);
          });
          stmt.finalize();
          console.log("✅ Sample properties inserted into SQLite database");
        }
      }
    );
  });
};
