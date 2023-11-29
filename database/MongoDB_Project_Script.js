//Come back to this part when we have time, focus on the Content part for now.
db.Announcements.insert({
  AnnouncementID: ObjectId(), // MongoDB automatically creates a unique _id, but if you want a separate field, you can use ObjectId()
  CreationDate: new Date(),
  AnnouncementText: "Your announcement text goes here",
  UpdatedDate: new Date() // Set this to the current date as a placeholder
});

// Focus here

db.Content.insert({
  _id: ObjectId("655a0db33961f9437c3aa268"),
  AuthorEmail: "kingtut10101@gmail.com", // This would be your FK, ensure this references an existing document in the Users collection (if you have one)
  ContentType: "map", // This should be one of your predefined options: map, mod, puzzle
  ContentFileSize: 7000, // Replace with the actual file size
  Title: "Classic Map",
  Description: "This Map is a certified classic",
  CreationDate: new Date("2020-03-27T12:12:12.948Z"),
  Downloads: 461, // Assuming no downloads when first creating the content
  Tags: ["Classic", "Sand", "Game"], // An array of strings representing tags
  UpdatedDate: new Date("2021-01-17T09:30:13.948Z") // Set this to the current date as a placeholder
});