// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract Vote {
    // Variables
    address electionComision;
    address public winner;

    // Structs
    struct Voter {
        string name;
        uint age;
        uint voterId;
        string gender;
        uint voteCandidateId;
        address voterAddress;
    }

    struct Candidate {
        string name;
        string party;
        uint age;
        string gender;
        uint candidateId;
        address candidateAddress;
        uint votes;
    }

    // Counters for IDs
    uint nextVoterId = 1;
    uint nextCandidateId = 1;

    // Election time
    uint startTime;
    uint endTime;

    // Mappings to store voter and candidate details
    mapping(uint => Voter) voterDetails;
    mapping(uint => Candidate) candidateDetails;

    // Flag to stop voting in emergency situations
    bool stopVoting;

    // Constructor
    constructor() {
        electionComision = msg.sender;
    }

    // Modifier to check if voting is over
    modifier isVotingOver() {
        require(block.timestamp > endTime || stopVoting == true, "Voting is not over");
        _;
    }

    // Modifier to check if the caller is the election commissioner
    modifier onlyCommisioner() {
        require(electionComision == msg.sender, "Not from election commision");
        _;
    }

    // Function to register a candidate
    function candidateRegister(string calldata _name, string calldata _party, uint _age, string calldata _gender) external {
        require(msg.sender != electionComision, "You are from election commision");
        require(candidateVerification(msg.sender) == true, "Candidate Already Registered");
        require(_age >= 18, "You are not eligible");
        require(nextCandidateId < 3, "Candidate Registration Full");

        candidateDetails[nextCandidateId] = Candidate(_name, _party, _age, _gender, nextCandidateId, msg.sender, 0);
        nextCandidateId++;
    }

    // Function to verify if a candidate is already registered
    function candidateVerification(address _person) internal view returns(bool){
        for(uint i = 1; i < nextCandidateId; i++) {
            if(candidateDetails[i].candidateAddress == _person) {
                return false;
            }
        }
        return true;
    }

    // Function to get a list of all candidates
    function candidateList() public view returns(Candidate[] memory) {
        Candidate[] memory array = new Candidate[](nextCandidateId - 1);
        for(uint i = 1; i < nextCandidateId; i++) {
            array[i - 1] = candidateDetails[i];
        }
        return array;
    }

    // Function to register a voter
    function voterRegister(string calldata _name, uint _age, string calldata _gender) external {
        require(voterVerification(msg.sender) == true, "Voter Already Registered");
        require(_age >= 18, "You are not eligible");

        voterDetails[nextVoterId] = Voter(_name, _age, nextVoterId, _gender, 0, msg.sender);
        nextVoterId++;
    }

    // Function to verify if a voter is already registered
    function voterVerification(address _person) internal view returns(bool){
        for(uint i = 1; i < nextVoterId; i++) {
            if(voterDetails[i].voterAddress == _person) {
                return false;
            }
        }
        return true;
    }

    // Function to get a list of all voters
    function voterList() public view returns(Voter[] memory) {
        Voter[] memory array = new Voter[](nextVoterId - 1);
        for(uint i = 1; i < nextVoterId; i++) {
            array[i - 1] = voterDetails[i];
        }
        return array;
    }

    // Function for a voter to cast a vote
    function vote(uint _voterId, uint _id) external {
        require(voterDetails[_voterId].voteCandidateId == 0, "Already voted");
        require(voterDetails[_voterId].voterAddress == msg.sender, "You are not a voter");
        require(startTime != 0, "Voting not started");
        require(nextCandidateId == 3, "Candidate registration not done yet");
        require(_id > 0 && _id < 3, "Invalid Candidate Id");

        voterDetails[_voterId].voteCandidateId = _id;
        candidateDetails[_id].votes++;
    }

    // Function for the election commissioner to set the voting time
    function voteTime(uint _startTime, uint _endTime) external onlyCommisioner() {
        startTime = block.timestamp + _startTime;
        endTime = startTime + _endTime;
    }

    // Function to get the current voting status
    function votingStatus() public view returns(string memory) {
        if (startTime == 0) {
            return "Voting has not started";
        } else if ((startTime != 0 && endTime > block.timestamp) && stopVoting == false) {
            return "In progress";
        } else {
            return "Ended";
        }
    }

    // Function to determine the winner
    function result() external onlyCommisioner() {
        require(nextCandidateId > 1, "No candidates registered");

        uint maximumVotes = 0;
        address currentWinner;

        for (uint i = 1; i < nextCandidateId; i++) {
            if (candidateDetails[i].votes > maximumVotes) {
                maximumVotes = candidateDetails[i].votes;
                currentWinner = candidateDetails[i].candidateAddress;
            }
        }

        winner = currentWinner;
    }

    // Function for the election commissioner to stop voting in an emergency
    function emergency() public onlyCommisioner() {
        stopVoting = true;
    }
}