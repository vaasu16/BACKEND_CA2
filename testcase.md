# Thunder Client Test Cases

## Student Feedback Management API

**Technology:** Node.js, Express.js, MongoDB, Mongoose  
**Base URL:** `http://localhost:3000`  
**Feedback endpoint:** `http://localhost:3000/api/feedback`

## Before testing

1. Configure a working MongoDB connection in the project's environment.
2. Start the API from the project directory with `npm start`.
3. In Thunder Client, create each request below. For requests with a body, select **Body > JSON** and set `Content-Type: application/json`.
4. Submit at least three feedback records before testing pagination.

## Test cases

### TC-01 — Submit valid feedback

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/feedback`
- **Body (JSON):**

```json
{
  "studentName": "Aarav Sharma",
  "courseName": "Backend Development",
  "message": "The session was clear and useful.",
  "rating": 5
}
```

- **Expected:** `201 Created`. The response contains a success message and a `feedback` object with the submitted details. The new record has `status: "Pending"` by default and an `_id`. Copy that `_id` for TC-08.

### TC-02 — Reject missing required fields

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/feedback`
- **Body (JSON):**

```json
{
  "studentName": "Aarav Sharma",
  "rating": 4
}
```

- **Expected:** `400 Bad Request` with a validation error. No feedback record is created.

### TC-03 — Reject a rating below the allowed range

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/feedback`
- **Body (JSON):**

```json
{
  "studentName": "Diya Patel",
  "courseName": "Backend Development",
  "message": "Testing the minimum rating.",
  "rating": 0
}
```

- **Expected:** `400 Bad Request` with a rating validation error. No feedback record is created.

### TC-04 — Reject a rating above the allowed range

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/feedback`
- **Body (JSON):**

```json
{
  "studentName": "Diya Patel",
  "courseName": "Backend Development",
  "message": "Testing the maximum rating.",
  "rating": 6
}
```

- **Expected:** `400 Bad Request` with a rating validation error. No feedback record is created.

### TC-05 — Retrieve the first page with a limit

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/feedback?page=1&limit=2`
- **Body:** None
- **Expected:** `200 OK`. The response contains:
  - `feedback`: at most two records
  - `currentPage`: `1`
  - `totalRecords`: total number of saved feedback records

### TC-06 — Retrieve feedback using default pagination

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/feedback`
- **Body:** None
- **Expected:** `200 OK`, with `currentPage: 1`, `totalRecords`, and up to 10 feedback records in `feedback`.

### TC-07 — Reject invalid pagination values

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/feedback?page=0&limit=2`
- **Body:** None
- **Expected:** `400 Bad Request` with the message `Page and limit must be positive integers`.

### TC-08 — Update an existing feedback status

Replace `<FEEDBACK_ID>` with the `_id` copied from TC-01.

- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/feedback/<FEEDBACK_ID>`
- **Body (JSON):**

```json
{
  "status": "Reviewed"
}
```

- **Expected:** `200 OK`. The response contains an update success message and a `feedback` object whose `status` is `Reviewed`.

### TC-09 — Reject an unsupported status

Replace `<FEEDBACK_ID>` with a valid ID copied from a created record.

- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/feedback/<FEEDBACK_ID>`
- **Body (JSON):**

```json
{
  "status": "Approved"
}
```

- **Expected:** `400 Bad Request` with the message `Status must be Pending or Reviewed`.

### TC-10 — Return not found for a valid but nonexistent ID

- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/feedback/507f1f77bcf86cd799439011`
- **Body (JSON):**

```json
{
  "status": "Reviewed"
}
```

- **Expected:** `404 Not Found` with the message `Feedback record not found`.

### TC-11 — Reject a malformed feedback ID

- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/feedback/not-a-valid-id`
- **Body (JSON):**

```json
{
  "status": "Reviewed"
}
```

- **Expected:** `400 Bad Request` with the message `Invalid feedback ID`.

## Assessment checklist

- [ ] Valid feedback is saved and returns `201 Created`.
- [ ] Required fields and rating range are validated.
- [ ] `GET` supports `page` and `limit` and returns the correct records for the requested page.
- [ ] Pagination response includes `currentPage` and `totalRecords`.
- [ ] A feedback status can be updated by its MongoDB ID.
- [ ] Invalid input and missing records return appropriate HTTP error codes.

