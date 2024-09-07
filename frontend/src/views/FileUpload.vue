<template>
  <div class="container">
    <h2>Upload Files</h2>

    <!-- Container for the file input and buttons -->
    <div class="upload-actions">
      <input type="file" multiple @change="handleFileUpload" />

      <!-- Container for Upload and Calculate buttons -->
      <div class="buttons-container">
        <button
          @click="uploadFilesToServer"
          :disabled="uploadLoading || calculateLoading"
        >
          Upload Files
        </button>

        <button
          @click="calculateTokensForUser"
          :disabled="!userId || uploadLoading || calculateLoading"
        >
          Calculate Tokens
        </button>

        <!-- Spinner for upload and calculate processes -->
        <div
          class="loading-spinner"
          :class="{ visible: uploadLoading || calculateLoading }"
        ></div>
      </div>
    </div>

    <!-- Bar chart for similarity results -->
    <canvas id="similarityChart" width="400" height="200"></canvas>

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
      selectedFiles: [],
      lastUploadedFiles: [],
      userId: null,
      comparisonResults: [],
      lastProcessedUserId: null,
      uploadLoading: false,
      calculateLoading: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFiles = Array.from(event.target.files);
    },
    async uploadFilesToServer() {
      if (this.selectedFiles.length < 2) {
        alert("Please select at least 2 files.");
        return;
      }

      const currentFileNames = this.selectedFiles
        .map((file) => file.name)
        .sort()
        .join(",");
      const lastFileNames = this.lastUploadedFiles
        .map((file) => file.name)
        .sort()
        .join(",");

      if (currentFileNames === lastFileNames) {
        alert("These files have already been uploaded.");
        return;
      }

      try {
        this.uploadLoading = true;
        const uploadData = await uploadFiles(this.selectedFiles);
        this.userId = uploadData.userId;
        this.lastUploadedFiles = [...this.selectedFiles];
        console.log("Files uploaded successfully. User ID:", this.userId);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        this.uploadLoading = false;
      }
    },
    async calculateTokensForUser() {
      try {
        if (!this.userId) {
          throw new Error("User ID is not available. Upload files first.");
        }

        if (this.userId === this.lastProcessedUserId) {
          alert("Calculation already completed for current data.");
          return;
        }

        this.calculateLoading = true;
        const comparisonResults = await calculateTokens(this.userId);
        this.comparisonResults = comparisonResults;

        this.lastProcessedUserId = this.userId;
        this.createBarChart(); // Call to create the bar chart
        console.log("Token calculation completed.");
      } catch (error) {
        console.error("Error calculating tokens:", error);
      } finally {
        this.calculateLoading = false;
      }
    },
    createBarChart() {
      const ctx = document.getElementById("similarityChart").getContext("2d");

      const labels = this.comparisonResults.map((result, index) => {
        const textFilename =
          result[`text${index + 1}Filename`] || "Unknown File";
        const patternFilename =
          result[`pattern${index + 1}Filename`] || "Unknown File";
        return `${textFilename} vs ${patternFilename}`;
      });

      const similarityData = this.comparisonResults.map((result) =>
        parseFloat(result.similarityScore)
      );

      const backgroundColors = this.generateBarColors(similarityData);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Similarity Percentage",
              data: similarityData,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map((color) =>
                color.replace("0.2", "1")
              ),
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Similarity Percentage",
              },
            },
            x: {
              title: {
                display: true,
                text: "Comparisons (File vs File)",
              },
            },
          },
        },
      });
    },
    generateBarColors(data) {
      return data.map((value) => {
        if (value >= 70) {
          return "rgba(255, 99, 132, 0.2)"; // Red for high similarity
        } else if (value >= 41 && value <= 69) {
          return "rgba(255, 205, 86, 0.2)"; // Yellow for moderate similarity
        } else {
          return "rgba(75, 192, 192, 0.2)"; // Green for low similarity
        }
      });
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
