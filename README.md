RKR-GST (Rabin-Karp Rolling Hash with Greedy String Tiling)

Overview

RKR-GST is a tool designed for pattern matching and token scanning in text and code analysis. It uses the Rabin-Karp hashing algorithm combined with Greedy String Tiling (GST) for efficient string matching, ideal for large datasets.

Features

    •	Pattern Matching: Uses Rabin-Karp and Greedy String Tiling for efficient string comparison.
    •	Token Marking: Identifies and marks occluded tokens for more precise results.

Technologies Used

    •	JavaScript/Node.js: Core logic for pattern matching.
    •	Express.js: Backend server.
    •	MongoDB: Database for storage.
    •	Doubly Linked List: For token management.
    •	Flex (C++ Lexer): Token generation.

File Structure

    •	scanpattern.js: Implements pattern scanning.
    •	markarrays.js: Manages token marking and occlusion.
    •	rkr.js: Contains Rabin-Karp hash logic.
    •	main.js: Main entry for token processing.
    •	preprocessing.py: Preprocesses C++ files.
    •	tokenizer.l: Implements tokenization rules

Installation

    1.	Clone the repository:
    git clone https://github.com/LegMateo/RKR-GST.git

    2.	Install dependencies:
    npm install

    3.	Set up environment variables:
    MONGODB_URI=<Your MongoDB connection URI>
    PREPROCESSING_SCRIPT_PATH=/Path/to/python/scrypt/tokenizer/preprocessing.py
    TOKENIZER_SCRIPT_PATH=./tokenizer/tokenizer
    PORT=3000

    4. Change local path in server.js, const preprocessingCmd:

    For MacOS example:
    source /Users/mateo/Desktop/Zavrsni/tokenizer/venv/bin/activate && python3 /path/to/preprocessing.py userId fileId

    For Windows:
    On Windows, you’ll likely need to activate the virtual environment using a venv .bat file, and use python (instead of python3)
    C:\path\to\venv\Scripts\activate.bat && python C:\path\to\preprocessing.py userId fileId

    5.	Start the backend on RKR-GST directory:
    npm start

    6. Start frontend on frontend directory:
    npm run serve

Literature

    1. Durić, Z., & Gašević, D. (2012). A source code similarity system for plagiarism detection. The Computer Journal, Advance Access. https://doi.org/10.1093/comjnl/bxs01

    2. Wise, M. J. (1993). String similarity via greedy string tiling and running Karp-Rabin matching. Unpublished manuscript, Basser Department of Computer Science, University of Sydney, Australia.
