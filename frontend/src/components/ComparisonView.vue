<template>
  <div class="comparison-container">
    <div v-if="filteredComparisons.length > 0">
      <div
        v-for="(result, index) in filteredComparisons"
        :key="index"
        class="comparison-item"
      >
        <h4>Comparison {{ index + 1 }}</h4>
        <h4>Similarity Score: {{ result.similarityScore }} %</h4>

        <div class="comparison-container">
          <div class="code-section">
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
                  textFileMetadata[index],
                  result.similarityScore
                )
              "
            ></pre>
          </div>

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
                  patternFileMetadata[index],
                  result.similarityScore
                )
              "
            ></pre>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No plagiarism detected.</p>
    </div>
  </div>
</template>

<script>
import { fetchProcessedCodes } from "../services/index.js";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

export default {
  props: ["comparisons", "userId"],
  data() {
    return {
      localComparisons: [],
      textProcessedCodes: [],
      patternProcessedCodes: [],
      textFileMetadata: [],
      patternFileMetadata: [],
      lastProcessedUserId: null,
      loading: false,
    };
  },
  computed: {
    filteredComparisons() {
      return this.localComparisons.filter((result) => result.similarityScore);
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
      this.loading = true;
      try {
        this.textProcessedCodes = [];
        this.patternProcessedCodes = [];
        this.textFileMetadata = [];
        this.patternFileMetadata = [];

        const processedCodes = await fetchProcessedCodes(this.userId);

        processedCodes.forEach((processedCode, index) => {
          const comparison = this.localComparisons[index];

          if (comparison) {
            const textCode = processedCode.textCode || "";
            const patternCode = processedCode.patternCode || "";

            this.textProcessedCodes.push(textCode);
            this.patternProcessedCodes.push(patternCode);

            this.textFileMetadata.push(comparison.textMetadata || []);
            this.patternFileMetadata.push(comparison.patternMetadata || []);
          } else {
            console.error(`No comparison found for index: ${index}`);
          }
        });
      } catch (error) {
        console.error("Error loading processed codes:", error);
      } finally {
        this.loading = false;
      }
    },

    applySyntaxHighlighting(code) {
      return Prism.highlight(code, Prism.languages.cpp, "cpp");
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

    highlightCodeWithMetadataAndScore(html, metadata, similarityScore) {
      if (!html || !metadata || !Array.isArray(metadata)) {
        return html;
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      let highlightClass = "";
      if (similarityScore >= 76) {
        highlightClass = "highlight-high";
      } else if (similarityScore >= 41 && similarityScore <= 75) {
        highlightClass = "highlight-moderate";
      } else {
        highlightClass = "highlight-low";
      }

      metadata.forEach(({ line, column }) => {
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
                    `Applying ${highlightClass} to: "${tokenParent.textContent.trim()}" at line ${currentLine}, column ${
                      position + 1
                    }`
                  );
                  tokenParent.classList.add("highlight", highlightClass);
                  found = true;
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

    getFinalHighlightedCode(code, metadata, similarityScore) {
      const highlightedCode = this.applySyntaxHighlighting(code);

      const wrappedCode = this.wrapUnrecognizedTokens(highlightedCode);

      return this.highlightCodeWithMetadataAndScore(
        wrappedCode,
        metadata,
        similarityScore
      );
    },
  },
  mounted() {
    this.loadProcessedCodes();
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
