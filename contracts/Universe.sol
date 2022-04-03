// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Universe is ERC1155, Ownable {

    uint256 public constant COMET = 0;
    uint256 public constant STAR = 1;
    uint256 public constant SUN = 2;
    uint256 public constant EARTH = 3;

    constructor()
        ERC1155("https://bafybeieak75ybqmlyqdm766s3kb24vfffegva2uify346jeyno6s2fnrgm.ipfs.dweb.link/metadata/{id}")
    {
        _mint(msg.sender, COMET, 10**18, "");
        _mint(msg.sender, STAR, 10**27, "");
        _mint(msg.sender, SUN, 1, "");
        _mint(msg.sender, EARTH, 1, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}