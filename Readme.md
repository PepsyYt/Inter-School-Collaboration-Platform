# 🏫 **School Collaboration Platform - Smart Contract**

---

## 🚀 **Vision**

The **School Collaboration Platform** aims to foster collaborative learning and knowledge sharing between educational institutions. Leveraging **blockchain technology**, this platform creates a **decentralized and transparent environment** for schools to propose and accept joint projects, ensuring **trust, accountability, and immutability** of collaboration agreements. This enables schools to engage in meaningful educational partnerships globally.

---

## ✨ **Features**

### 1. **Decentralized Collaboration Requests**  
- Schools can initiate collaboration requests on-chain, ensuring **transparency** and **public verifiability**.
- Stores **project details** and maintains a clear record of pending or accepted requests.

### 2. **Immutable Records**  
- Every request is stored **immutably on the blockchain**, making agreements **tamper-proof**.
- Schools can rely on the platform for a **trusted history** of collaborations.

### 3. **Two-Way Approval Mechanism**  
- Schools can submit requests, and receiving schools must **explicitly accept** them.
- Ensures **mutual consent** before projects are initiated.

### 4. **Book and Course Purchases via Aptos Wallet**  
- Schools and individuals can **purchase books and courses** directly on the platform.
- Integrated with the **Aptos wallet** for secure and convenient transactions.

---

## 🎥 Video of **Successful Execution**
https://drive.google.com/drive/folders/1XgP3kkluXh24DO9ZjVT3JYXHtMgfE6Kl?usp=sharing

## ⚙️ **Smart Contract Overview**

move
module SchoolCollabPlatform::CollabContract {

    use aptos_framework::signer;
    use std::string::String;

    struct CollaborationRequest has store, key {
        requesting_school: address,
        project_details: String,
        accepted: bool,
    }

    public fun create_request(
        requester: &signer, 
        project_details: String
    ) {
        let request = CollaborationRequest {
            requesting_school: signer::address_of(requester),
            project_details,
            accepted: false,
        };
        move_to(requester, request);
    }

    public fun accept_request(
        accepter: &signer, 
        requester_address: address
    ) acquires CollaborationRequest {
        let request = borrow_global_mut<CollaborationRequest>(requester_address);
        request.accepted = true;
    }

## 📑 **Smart Contract Functionality**
create_request(requester: &signer, project_details: String)
Creates a new collaboration request.
Stores the requesting school’s address, project details, and marks the request as pending.
accept_request(accepter: &signer, requester_address: address)
Allows the receiving school to accept a pending request.
Updates the request status to accepted = true.

## 🔗 Transaction Details
Transaction ID: 0xb3a9b757a774ef78f794d2752fce7998c87b6ed9a90454ea5270168aab7d1afc
<img src="https://github.com/PepsyYt/Inter-School-Collaboration-Platform/blob/main/Screenshot%202024-10-29%20192039.png" alt="Sample Image" width="500">


## 🌐 Live Server
Access the platform live at https://inter-school-collaboration-platform.vercel.app/

## 🔭 Future Scope
Frontend Interface Integration

Develop a web or mobile interface where schools can browse, propose, and accept collaborations.
Enable real-time notifications for request updates.
Multi-Party Collaborations

Support multi-school partnerships for larger projects or events.
Token Incentives

Introduce token-based incentives to reward active participants.
Schools earn tokens upon achieving project milestones or collaboration goals.
Project Progress Tracking

Add a milestone tracking feature to monitor project phases.
Schools can submit periodic reports to ensure smooth execution.
Global Collaborations

Facilitate cross-border collaborations between international schools using blockchain, reducing trust barriers.
## 🎯 Conclusion

The School Collaboration Platform empowers schools to build secure and decentralized partnerships. By bridging geographical gaps, it promotes educational growth through collaborative efforts. With planned upgrades, the platform aims to become a key driver in shaping global education by enabling schools to connect, collaborate, and grow—together.

## 📜 License
This project is licensed under the MIT License.
