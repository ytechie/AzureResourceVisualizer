 module ArmViz {
    export function getToolboxItems() {
        var toolboxItems:Array<ToolboxResource> = [
        new ToolboxResource(
            "Virtual machine.png",
            "Virtual Machine",
            'Microsoft.Compute/virtualMachines',
            true),
        new ToolboxResource(
            "Unidentified feature object.png",
            "VM Extension",
            'Microsoft.Compute/virtualMachines/extensions' ),
        new ToolboxResource(
            "Availability Set.png",
            "Availability Set",
            'Microsoft.Compute/availabilitySets' ),
        new ToolboxResource(
            "Azure load balancer.png",
            "Load Balancer",
            'Microsoft.Network/loadBalancers',
            true ),
        new ToolboxResource(
            "Virtual Network.png",
            "Network",
            'Microsoft.Network/virtualNetworks',
            true ),
        new ToolboxResource(
            "NIC.png",
            "NIC",
            'Microsoft.Network/networkInterfaces',
            true ),
        new ToolboxResource(
            "Service Endpoint.png",
            "Public IP",
            'Microsoft.Network/publicIPAddresses',
            true ),
        new ToolboxResource(
            "Unidentified feature object.png",
            "NSG",
            'Microsoft.Network/networkSecurityGroups' ),
        new ToolboxResource(
            "Unidentified feature object.png",
            "App Gateway",
            'Microsoft.Network/applicationGateways' ),
        new ToolboxResource(
            "Storage (Azure).png",
            "Storage Acct",
            'Microsoft.Storage/storageAccounts',
            true ),
        new ToolboxResource(
            "Unidentified feature object.png",
            "Automation",
            'Microsoft.Automation/automationAccounts' ),
        new ToolboxResource(
            "Logic App.png",
            "Workflow",
            'Microsoft.Logic/workflows' ),
        new ToolboxResource(
            "Deployment.png",
            "Deployment",
            'Microsoft.Resources/deployments' ),
        new ToolboxResource(
            "Web App (was Websites).png",
            "Server Farm",
            'Microsoft.Web/serverfarms' ),
        new ToolboxResource(
            "Cloud Service.png",
            "Hosting Env",
            'Microsoft.Web/hostingEnvironments' ),
        new ToolboxResource(
            "Key Vault.png",
            "Key Vault",
            'Microsoft.KeyVault/vaults' ),
        new ToolboxResource(
            "Azure SQL Database.png",
            "SQL Server",
            'Microsoft.Sql/servers'),
        new ToolboxResource(
            "Web App (was Websites).png",
            "Web App",
            'Microsoft.Web/sites'),
        new ToolboxResource(
            "Web App (was Websites).png",
            "Server Farm",
            'Microsoft.Web/serverFarms'),
        new ToolboxResource(
            "Autoscaling.png",
            "Auto Scale",
            'microsoft.insights/autoscalesettings'),
        new ToolboxResource(
            "Azure alert.png",
            "Alert Rules",
            'microsoft.insights/alertrules'),
        new ToolboxResource(
            "Operational Insights.png",
            "Insights",
            'microsoft.insights/components'),
        new ToolboxResource(
            "Web App (was Websites).png",
            "Web Site",
            'Microsoft.Web/Sites'),
        new ToolboxResource(
            "API App.png",
            "API App",
            'Microsoft.AppService/apiApps'),
        new ToolboxResource(
            "Unidentified feature object.png",
            "App Gateway",
            'Microsoft.AppService/gateways'),
        new ToolboxResource(
            "Availability Set.png",
            "VM Scale Set",
            'Microsoft.Compute/virtualMachineScaleSets'),
        new ToolboxResource(
            "cdn.png",
            "CDN Profile",
            'Microsoft.Cdn/Profiles',
            true ),
        new ToolboxResource(
            "cdn.png",
            "CDN Endpoint",
            'Microsoft.Cdn/Profiles/Endpoints',
            true )
        ];
        
        return toolboxItems;
    }
 }