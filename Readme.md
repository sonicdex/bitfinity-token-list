# Token List Repository

This repository manages a list of tokens for the Sonic Bitfinity ecosystem. Follow the steps below to add your token and create a pull request (PR) for approval.

## Prerequisites

1. **Git**: Ensure you have Git installed on your system.
2. **Node.js**: Install Node.js (version 20 or higher is recommended).
3. **Yarn**: Install Yarn for dependency management.

## Adding a New Token

### Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
git clone <https://github.com/sonicdex/bitfinity-token-list.git>
cd bitfinity-token-list
```

### Step 2: **Install Dependencies**

Run the following command to install the required dependencies:

```bash
yarn install
```

### Step **3: Create a Token Folder**

Navigate to the src/tokens directory and create a new folder named after your token (e.g., MYTOKEN):

```bash
mkdir src/tokens/MYTOKEN
```

### Step **4: Add metadata.json**

Inside the folder you just created, add a metadata.json file with the following structure:

```bash
{
  "address": "0xYourTokenAddress",
  "decimals": 18,
  "name": "Your Token Name",
  "symbol": "YOUR",
  "logoURI": "https://path-to-your-token-logo/logo.png"
}
```

- address: The token’s address (must be a valid ERC20 address).
- decimals: Number of decimal places for the token balance.
- name: The token’s full name (max 60 characters).
- symbol: The token’s symbol (max 20 characters).
- logoURI: A valid URI pointing to your token logo (suggested size: 64x64 pixels, in Webp format).

### Step **5: Optional Logo Upload**

If you don’t have an external link for your token logo, add the logo file with filename `logo.webp` to the same folder. Ensure the logoURI in your metadata.json points to the file name.

## **Validating Your Token**

Run the validation script to ensure your token metadata is valid and doesn’t conflict with the existing token list:

```bash
yarn validate
```

If there are any errors, the script will display details for corrections.

## **Submitting a Pull Request**

**Step 1: Commit Your Changes**

Create a new branch and commit your changes:

```bash
git checkout -b add-my-token
git add src/tokens/MYTOKEN
git commit -m "feat: add MYTOKEN to token list"
```

**Step 2: Push Your Branch**

```bash
git push -u origin add-my-token
```

**Step 3: Open a Pull Request**

1. Go to the repository on GitHub.
2. Open the **Pull Requests** tab.
3. Click **New Pull Request**.
4. Compare your branch (add-my-token) with main.
5. Add a meaningful description and submit your PR.

## **Versioning and Approval**

Once your PR is reviewed and merged:

- The version of the token list will automatically update.
- Your token will be included in the main token list.

For any questions or issues, feel free to open a GitHub issue or reach out to the maintainers.

**Example Token Folder Structure**

```bash
src/tokens/MYTOKEN/
  ├── metadata.json
  └── logo.webp (optional)
```