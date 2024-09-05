<template>
  <div class="comparison-container">
    <!-- Check if there are any comparisons to display -->
    <div v-if="filteredComparisons.length > 0">
      <div
        v-for="(result, index) in filteredComparisons"
        :key="index"
        class="comparison-item"
      >
        <h4>Comparison {{ index + 1 }}</h4>
        <h4>Similarity Score: {{ result.similarityScore }}</h4>

        <div class="comparison-container">
          <!-- Text File Processed Code -->
          <div class="code-section">
            <!-- Move the Text Filename right after the header -->
            <p v-if="result[`text${index + 1}Filename`]">
              {{ result[`text${index + 1}Filename`] }}
            </p>
            <h5>Text File Processed Code:</h5>

            <pre
              class="code-box"
              v-if="textProcessedCodes[index]"
              v-html="
                getFinalHighlightedCode(
                  textProcessedCodes[index],
                  textFileMetadata[index]
                )
              "
            ></pre>
          </div>

          <!-- Pattern File Processed Code -->
          <div class="code-section">
            <p v-if="result[`pattern${index + 1}Filename`]">
              {{ result[`pattern${index + 1}Filename`] }}
            </p>
            <h5>Pattern File Processed Code:</h5>

            <pre
              class="code-box"
              v-if="patternProcessedCodes[index]"
              v-html="
                getFinalHighlightedCode(
                  patternProcessedCodes[index],
                  patternFileMetadata[index]
                )
              "
            ></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Show a popup if no comparisons meet the criteria -->
    <div v-else>
      <p>No plagiarism detected.</p>
    </div>
  </div>
</template>

<script>
import {
  fetchProcessedCode,
  calculateTokens,
  uploadFiles,
} from "../services/index.js";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

export default {
  props: ["comparisons", "userId"],
  data() {
    return {
      localComparisons: [], // Local reactive copy of comparisons
      textProcessedCodes: [],
      patternProcessedCodes: [],
      textFileMetadata: [],
      patternFileMetadata: [],
      lastProcessedUserId: null, // Track last processed userId
      loading: false,
    };
  },
  computed: {
    // Computed property to filter comparisons by similarity score
    filteredComparisons() {
      return this.localComparisons.filter(
        (result) => result.similarityScore >= 0.65
      );
    },
  },
  watch: {
    comparisons: {
      immediate: true,
      handler(newComparisons) {
        this.localComparisons = [...newComparisons];
        this.loadProcessedCodes();
      },
    },
  },
  methods: {
    async loadProcessedCodes() {
      this.loading = true; // Start loading
      try {
        // Clear the arrays only if loading new data
        this.textProcessedCodes = [];
        this.patternProcessedCodes = [];
        this.textFileMetadata = [];
        this.patternFileMetadata = [];

        for (let i = 0; i < this.localComparisons.length; i++) {
          const textFileId = this.localComparisons[i].text1ProcessedCodeID;
          const patternFileId =
            this.localComparisons[i].pattern1ProcessedCodeId;

          if (!textFileId || !patternFileId) {
            continue;
          }

          const textCode = await fetchProcessedCode(this.userId, textFileId);
          const patternCode = await fetchProcessedCode(
            this.userId,
            patternFileId
          );

          this.textProcessedCodes.push(textCode || "");
          this.patternProcessedCodes.push(patternCode || "");

          this.textFileMetadata.push(
            this.localComparisons[i].textMetadata || []
          );
          this.patternFileMetadata.push(
            this.localComparisons[i].patternMetadata || []
          );
        }
      } catch (error) {
        console.error("Error fetching processed codes:", error);
      } finally {
        this.loading = false; // Stop loading once data is fetched
      }
    },
    async handleNewUpload(files) {
      try {
        this.loading = true;

        // Upload the files
        const uploadResponse = await uploadFiles(files);
        const { userId } = uploadResponse;

        // Check if the current userId matches the last processed one
        if (userId === this.lastProcessedUserId) {
          alert("Calculation already completed for current data.");
          this.loading = false;
          return; // Exit the function to prevent re-calculation
        }

        // Trigger calculation and fetch new comparisons
        const newComparisons = await calculateTokens(userId);
        this.localComparisons = newComparisons;

        // Update the last processed userId
        this.lastProcessedUserId = userId;

        await this.loadProcessedCodes(); // Load new processed codes
      } catch (error) {
        console.error("Error during upload and calculation:", error);
      } finally {
        this.loading = false;
      }
    },

    applySyntaxHighlighting(code) {
      return Prism.highlight(code, Prism.languages.cpp, "cpp");
    },

    highlightCodeWithMetadata(html, metadata) {
      if (!html || !metadata || !Array.isArray(metadata)) {
        return html;
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      metadata.forEach(({ line, column }) => {
        console.log(`Marking line: ${line}, column: ${column}`);

        let found = false;
        let currentLine = 1;
        let position = 0;

        const walkNodes = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;

            for (let i = 0; i < text.length; i++) {
              if (currentLine === line && position === column - 1) {
                let tokenParent = node.parentNode;
                while (
                  tokenParent &&
                  !tokenParent.classList.contains("token")
                ) {
                  tokenParent = tokenParent.parentNode;
                }

                if (
                  tokenParent &&
                  !tokenParent.classList.contains("highlight")
                ) {
                  console.log(
                    `Applying highlight to: "${tokenParent.textContent.trim()}" at actual position line ${currentLine}, column ${
                      position + 1
                    }`
                  );
                  tokenParent.classList.add("highlight");
                  found = true;
                } else {
                  console.log(
                    `No tokenParent found or already highlighted at line ${line}, column ${column}.`
                  );
                }
                return;
              }
              position++;
              if (text[i] === "\n") {
                currentLine++;
                position = 0;
              }
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (
              let child = node.firstChild;
              child;
              child = child.nextSibling
            ) {
              walkNodes(child);
              if (found) break;
            }
          }
        };

        walkNodes(tempDiv);
      });

      return tempDiv.innerHTML;
    },

    wrapUnrecognizedTokens(html) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const wrapNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent;
          if (text.trim() && !node.parentNode.classList.contains("token")) {
            const span = document.createElement("span");
            span.className = "token unrecognized";
            span.textContent = text;
            node.replaceWith(span);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          let child = node.firstChild;
          while (child) {
            const nextSibling = child.nextSibling;
            wrapNodes(child);
            child = nextSibling;
          }
        }
      };

      wrapNodes(tempDiv);
      return tempDiv.innerHTML;
    },

    getFinalHighlightedCode(code, metadata) {
      // Step 1: Apply Prism highlighting
      const syntaxHighlightedCode = this.applySyntaxHighlighting(code);

      // Step 2: Wrap unrecognized tokens
      const wrappedCode = this.wrapUnrecognizedTokens(syntaxHighlightedCode);

      // Step 3: Apply metadata-based highlighting
      return this.highlightCodeWithMetadata(wrappedCode, metadata);
    },
  },
  mounted() {
    this.loadProcessedCodes(); // Load initial data
  },
};
</script>

<style scoped>
.comparison-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.comparison-item {
  width: 100%;
  text-align: center;
}

.code-section {
  width: 48%;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  box-sizing: border-box;
  margin-right: 1%;
}

.code-box {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
  text-align: left;
}

.highlight {
  background-color: yellow !important;
  color: black !important;
}
@media (max-width: 768px) {
  .code-section {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
