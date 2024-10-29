module SchoolCollabPlatform::CollabContract {

    use aptos_framework::signer;
    use std::string::String;

    /// Struct to represent a collaboration request between two schools.
    struct CollaborationRequest has store, key {
        requesting_school: address,  // Address of the requesting school
        project_details: String,     // Details about the collaboration project
        accepted: bool,              // Whether the request was accepted
    }

    /// Function to create a new collaboration request.
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

    /// Function to accept a pending collaboration request.
    public fun accept_request(
        accepter: &signer, 
        requester_address: address
    ) acquires CollaborationRequest {
        let request = borrow_global_mut<CollaborationRequest>(requester_address);
        request.accepted = true;
    }
}
