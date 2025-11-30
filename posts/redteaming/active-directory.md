# Active Directory

Active Directory is a proprietary directory service developed by Microsoft to manage authentication and authorization on a Windows domain network. Store information about objects on the network and makes it easily available to users and admins

Active Directory Domain Services (AD DS) enables centralized, secure management of an entire network, which might span a building, a city or multiple locations throughout the world

The `ntds.dit` file contains all directory information, including domain objects, schema definitions, and configuration data, organized into three main partitions: the domain partition, the schema partition, and the configuration partition. ntds.dit file is located in the `%SYSTEMROOT%\NTDS` folder by default, typically `C:\Windows\NTDS` 

**Key roles of Active Directory**:

- Authentication: Verifying the identity of a user or system (example confirming a username and password)
- Authorization: Determining what resources an authenticated user or system is allowed to access (example granting read/write permissions to a file share)

**Active Directory Domain Services (AD DS)** - Active Directory Domain Services is the core role or service of Active Directory that handles the directory data storage and management. AD DS enables centralized, secure management of an entire network, regardless of its size whether it is a small office or a vast, globally distributed enterprise spanning multiple cities or countries

The key functions of AD DS include:

- Identity Management: Managing user accounts, passwords, and security groups.
- Group Policy Management (GPO): Enforcing consistent security settings, desktop configurations, and software deployments across large groups of users and computers.
- Single Sign-On (SSO): Allowing a user to log in once to their computer and automatically gain access to multiple network resources without re-entering credentials.
- Resource Organization: Organizing network resources in a logical, hierarchical manner that mirrors the organization's structure.

## Active Directory - Components

- Domain Controller (DC)- A Domain Controller is a server that runs AD DS and holds a copy of the domain's directory database. All authentication and authorization requests are handled by the DC
- Schema - Defines objects and their attributes
- Query and index mechanism - Provides searching and publication of objects and their properties
- Global Catalog - Contains information about every object in the directory
- Replication Service - Distributes information across domain controllers

## Active Directory - Structure

- Forest - A Forest is the security boundary and the largest container in Active Directory. It is a collection of one or more Domains that share a single, common Schema, Global Catalog, and Configuration naming context

    Key Feature: All domains in a forest automatically trust each other (two-way transitive trust), meaning a user authenticated in one domain can access resources in any other domain within the same forest, provided they have authorization

- Tree - A Tree is a collection of one or more domains that share a contiguous DNS name space. For example, minato500.com and sales.minato500.com are domains in the same tree because they share the root name minato500.com

    Key Feature: Multiple trees can exist within a single forest

- Domain - A Domain is the core logical structure of AD DS. It is a group of users, computers, and other AD objects that share a common database, security policies, and authentication mechanism

    Key Feature: The domain is the boundary for most security policy application (via Group Policy Objects) and replication. Every domain has its own set of Domain Controllers

- Organizational Unit (OU) - An Organizational Unit (OU) is the smallest and most granular container used to organize objects within a domain (users, groups, computers, etc)

    Key Feature: OUs are used to delegate administrative control and to scope the application of Group Policy Objects (GPOs) For example, an OU could be created for the "Marketing Department" to delegate management of their user accounts to a local team member, and to apply a specific desktop background GPO just to those users