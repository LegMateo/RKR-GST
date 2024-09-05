<template>
  <div class="container">
    <h2>Upload Files</h2>

    <!-- Container for the file input and buttons -->
    <div class="upload-actions">
      <input type="file" multiple @change="handleFileUpload" />

      <!-- Container for Upload and Calculate buttons -->
      <div class="buttons-container">
        <!-- Upload Files Button -->
        <button
          @click="uploadFilesToServer"
          :disabled="uploadLoading || calculateLoading"
        >
          Upload Files
        </button>

        <!-- Calculate Tokens Button -->
        <button
          @click="calculateTokensForUser"
          :disabled="!userId || uploadLoading || calculateLoading"
        >
          Calculate Tokens
        </button>

        <!-- Spinner for both upload and calculate processes, always positioned next to "Calculate Tokens" button -->
        <div
          class="loading-spinner"
          :class="{ visible: uploadLoading || calculateLoading }"
        ></div>
      </div>
    </div>

    <!-- Pass the comparison results to the ComparisonView component -->
    <ComparisonView
      v-if="comparisonResults.length"
      :comparisons="comparisonResults"
      :userId="userId"
    />
  </div>
</template>

<script>
import { uploadFiles, calculateTokens } from "../services/index.js";
import ComparisonView from "@/components/ComparisonView.vue";

export default {
  components: {
    ComparisonView,
  },
  data() {
    return {
      selectedFiles: [], // To store the selected files for upload
      lastUploadedFiles: [], // To track the last uploaded files
      userId: null, // To store userId after upload
      comparisonResults: [], // To store comparison results after calculation
      lastProcessedUserId: null, // To track the last processed userId
      uploadLoading: false, // Track upload loading state
      calculateLoading: false, // Track calculation loading state
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFiles = Array.from(event.target.files); // Store the selected files
    },
    async uploadFilesToServer() {
      // Check if at least 2 files are selected
      if (this.selectedFiles.length < 2) {
        alert("Please select at least 2 files.");
        return; // Exit the function to prevent uploading
      }

      // Generate a unique identifier for the current file selection
      const currentFileNames = this.selectedFiles
        .map((file) => file.name)
        .sort()
        .join(",");

      // Generate a unique identifier for the last uploaded files
      const lastFileNames = this.lastUploadedFiles
        .map((file) => file.name)
        .sort()
        .join(",");

      // Check if the current selection matches the last uploaded files
      if (currentFileNames === lastFileNames) {
        alert("These files have already been uploaded.");
        return; // Exit the function to prevent re-uploading
      }

      try {
        this.uploadLoading = true; // Start showing the loading spinner for upload

        // Upload files and get the userId
        const uploadData = await uploadFiles(this.selectedFiles);
        this.userId = uploadData.userId; // Store the userId for later use

        // Update the last uploaded files to the current files
        this.lastUploadedFiles = [...this.selectedFiles];

        console.log("Files uploaded successfully. User ID:", this.userId);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        this.uploadLoading = false; // Stop showing the loading spinner for upload
      }
    },
    async calculateTokensForUser() {
      try {
        if (!this.userId) {
          throw new Error("User ID is not available. Upload files first.");
        }

        // Check if the current userId matches the last processed one
        if (this.userId === this.lastProcessedUserId) {
          alert("Calculation already completed for current data.");
          return; // Exit the function to prevent re-calculation
        }

        this.calculateLoading = true; // Start showing the loading spinner for calculation

        // Calculate tokens and get the comparison results
        const comparisonResults = await calculateTokens(this.userId);
        this.comparisonResults = comparisonResults; // Directly assign the comparisons array

        // Update the last processed userId
        this.lastProcessedUserId = this.userId;

        console.log("Token calculation completed.");
      } catch (error) {
        console.error("Error calculating tokens:", error);
      } finally {
        this.calculateLoading = false; // Stop showing the loading spinner for calculation
      }
    },
  },
};
</script>

<style scoped>
/* Main container to align everything */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
}

/* Button container */
.buttons-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

/* Spinner */
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  visibility: hidden;
  margin-left: 10px;
}

.loading-spinner.visible {
  visibility: visible;
}

/* Upload section container */
.upload-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  margin-top: 10px;
}

/* Ensure the buttons take consistent width */
button {
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

input[type="file"] {
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
