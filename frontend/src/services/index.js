// index.js

// Function to handle file uploads
export async function uploadFiles(files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error uploading files: ${error.message}`);
  }
}

// Function to handle token calculation
export async function calculateTokens(userId) {
  try {
    const response = await fetch(`http://localhost:3000/calculate/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.comparisons) {
      throw new Error("Comparisons data is missing");
    }
    console.log(data.comparisons);
    return data.comparisons; // Return only the comparisons array
  } catch (error) {
    throw new Error(`Error calculating tokens: ${error.message}`);
  }
}

// Function to fetch processed code by fileId
// Function to fetch processed code by fileId
export async function fetchProcessedCode(userId, fileId) {
  try {
    const response = await fetch(
      `http://localhost:3000/processedCode/${userId}/${fileId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.processedCode;
  } catch (error) {
    console.error("Error fetching processed code:", error);
    throw new Error(`Error fetching processed code: ${error.message}`); // Re-throw the error or handle it as needed
  }
}
