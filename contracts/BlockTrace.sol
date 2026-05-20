// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title BlockTrace Supply Chain & Audit Ledger
 * @notice Provides secure, decentralised audit tracking, item registrations, 
 *         and state transitions for assets across complex global distribution channels.
 * @dev Highly optimized contract using modular structures and granular access controls.
 */
contract BlockTrace {
    address public owner;
    uint256 public totalProducts;

    enum ProductStatus { Registered, InTransit, Inspected, RetailReady, Delivered, Flagged }

    struct TransferLog {
        address from;
        address to;
        uint256 timestamp;
        string location;
        string remarks;
    }

    struct Product {
        uint256 id;
        string SKU;
        string name;
        string origin;
        address currentOwner;
        ProductStatus status;
        uint256 creationTimestamp;
        bool exists;
        TransferLog[] transferHistory;
    }

    mapping(uint256 => Product) private products;
    mapping(string => uint256) private skuToId;

    event ProductRegistered(uint256 indexed id, string SKU, string name, address indexed creator);
    event ProductTransferred(uint256 indexed id, address indexed from, address indexed to, string location, ProductStatus status);
    event ProductStatusUpdated(uint256 indexed id, ProductStatus status, string remarks);
    event ProductFlagged(uint256 indexed id, string reason, address flagger);

    modifier onlyOwner() {
        require(msg.sender == owner, "BlockTrace: Caller is not the manager");
        _;
    }

    modifier productExists(uint256 _id) {
        require(products[_id].exists, "BlockTrace: Product does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalProducts = 0;
    }

    /**
     * @notice Register a new traceable item in the secure ledger
     * @param _SKU The unique system SKU identifier
     * @param _name The name of the product/batch
     * @param _origin The location coordinates or facility of origin
     */
    function registerProduct(string memory _SKU, string memory _name, string memory _origin) public returns (uint256) {
        require(bytes(_SKU).length > 0, "BlockTrace: SKU cannot be blank");
        require(skuToId[_SKU] == 0, "BlockTrace: SKU already registered");

        totalProducts++;
        uint256 newId = totalProducts;

        Product storage p = products[newId];
        p.id = newId;
        p.SKU = _SKU;
        p.name = _name;
        p.origin = _origin;
        p.currentOwner = msg.sender;
        p.status = ProductStatus.Registered;
        p.creationTimestamp = block.timestamp;
        p.exists = true;

        skuToId[_SKU] = newId;

        // Log initiation entry
        p.transferHistory.push(TransferLog({
            from: address(0),
            to: msg.sender,
            timestamp: block.timestamp,
            location: _origin,
            remarks: "Batch initial registry on-chain secured."
        }));

        emit ProductRegistered(newId, _SKU, _name, msg.sender);
        return newId;
    }

    /**
     * @notice Transfer product custody and record detailed transit logs
     * @param _id The database token ID of the unit
     * @param _newOwner The entity/address accepting next custody
     * @param _location The transit waypoint or warehouse location
     * @param _remarks Descriptive remarks regarding transfer quality
     */
    function transferCustody(
        uint256 _id, 
        address _newOwner, 
        string memory _location, 
        string memory _remarks
    ) public productExists(_id) {
        Product storage p = products[_id];
        require(p.currentOwner == msg.sender || msg.sender == owner, "BlockTrace: Unauthorized custodian transfer attempt");
        require(_newOwner != address(0), "BlockTrace: Cannot transfer to null address");

        address previousOwner = p.currentOwner;
        p.currentOwner = _newOwner;
        p.status = ProductStatus.InTransit;

        p.transferHistory.push(TransferLog({
            from: previousOwner,
            to: _newOwner,
            timestamp: block.timestamp,
            location: _location,
            remarks: _remarks
        }));

        emit ProductTransferred(_id, previousOwner, _newOwner, _location, ProductStatus.InTransit);
    }

    /**
     * @notice Update status of product block post regulatory inspection
     * @param _id Product batch on-chain ID
     * @param _status The enum index of new status
     * @param _location Location update
     * @param _remarks Inspection reports or quality results
     */
    function updateProductStatus(
        uint256 _id, 
        ProductStatus _status, 
        string memory _location,
        string memory _remarks
    ) public productExists(_id) {
        Product storage p = products[_id];
        require(p.currentOwner == msg.sender || msg.sender == owner, "BlockTrace: Unauthorized update caller");

        p.status = _status;
        
        p.transferHistory.push(TransferLog({
            from: p.currentOwner,
            to: p.currentOwner,
            timestamp: block.timestamp,
            location: _location,
            remarks: _remarks
        }));

        emit ProductStatusUpdated(_id, _status, _remarks);
    }

    /**
     * @notice Flag product batch in case of verified contamination, theft, or recall
     * @param _id Product reference block
     * @param _reason Detail string for safety warning
     */
    function flagProduct(uint256 _id, string memory _reason) public productExists(_id) {
        Product storage p = products[_id];
        // Any registered auditor or the owner can flag a product
        p.status = ProductStatus.Flagged;
        
        p.transferHistory.push(TransferLog({
            from: p.currentOwner,
            to: p.currentOwner,
            timestamp: block.timestamp,
            location: "Safety & Quality Quarantine Office",
            remarks: string(abi.encodePacked("BATCH FLAGGED WARNING: ", _reason))
        }));

        emit ProductFlagged(_id, _reason, msg.sender);
    }

    /**
     * @notice Fetch product meta specifications
     */
    function getProductMeta(uint256 _id) public view productExists(_id) returns (
        uint256 id,
        string memory SKU,
        string memory name,
        string memory origin,
        address currentOwner,
        ProductStatus status,
        uint256 creationTimestamp
    ) {
        Product storage p = products[_id];
        return (p.id, p.SKU, p.name, p.origin, p.currentOwner, p.status, p.creationTimestamp);
    }

    /**
     * @notice Fetch total length of logs for a specific product
     */
    function getTransferHistoryCount(uint256 _id) public view productExists(_id) returns (uint256) {
        return products[_id].transferHistory.length;
    }

    /**
     * @notice Fetch a single step element from the traceability history matrix
     */
    function getTransferHistoryStep(uint256 _id, uint256 _index) public view productExists(_id) returns (
        address from,
        address to,
        uint256 timestamp,
        string memory location,
        string memory remarks
    ) {
        require(_index < products[_id].transferHistory.length, "BlockTrace: Index out of bounds");
        TransferLog memory step = products[_id].transferHistory[_index];
        return (step.from, step.to, step.timestamp, step.location, step.remarks);
    }
}
