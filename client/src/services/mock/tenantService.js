/**
 * Mock Tenant Service Layer
 * Simulates backend multi-tenant SaaS REST APIs
 */

const STORAGE_KEY_TENANTS = 'rm_tenants';

const INITIAL_TENANTS = [
  {
    id: 'restro_1',
    name: 'Royal Dhaba',
    slug: 'royaldhaba',
    type: 'Dhaba',
    ownerName: 'Rahul Sharma',
    email: 'owner@royaldhaba.com',
    phone: '9876543210',
    address: '123 Highway Expressway, GT Road, Delhi',
    tableCount: 15,
    subscription: {
      status: 'Active',
      plan: 'Premium',
      renewDate: '2027-01-01',
      monthlyPrice: 2999
    },
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'restro_2',
    name: 'Pizza Hub & Cafe',
    slug: 'pizzahub',
    type: 'Cafe',
    ownerName: 'Anita Roy',
    email: 'anita@pizzahub.com',
    phone: '9123456789',
    address: '45 MG Road, Connaught Place, New Delhi',
    tableCount: 10,
    subscription: {
      status: 'Active',
      plan: 'Basic',
      renewDate: '2026-12-15',
      monthlyPrice: 999
    },
    createdAt: '2026-02-01T11:30:00.000Z'
  },
  {
    id: 'restro_3',
    name: 'Spicy Bite Cloud Kitchen',
    slug: 'spicybite',
    type: 'Cloud Kitchen',
    ownerName: 'Vikram Malhotra',
    email: 'vikram@spicybite.com',
    phone: '9988776655',
    address: 'Sector 62, Noida, UP',
    tableCount: 0,
    subscription: {
      status: 'Suspended',
      plan: 'Basic',
      renewDate: '2026-06-30',
      monthlyPrice: 999
    },
    createdAt: '2026-03-10T14:20:00.000Z'
  }
];

// Load tenants from localStorage or seed initial data
export const getStoredTenants = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TENANTS);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error loading tenants from localStorage:', err);
  }
  localStorage.setItem(STORAGE_KEY_TENANTS, JSON.stringify(INITIAL_TENANTS));
  return INITIAL_TENANTS;
};

// Save tenants list
export const saveStoredTenants = (tenants) => {
  try {
    localStorage.setItem(STORAGE_KEY_TENANTS, JSON.stringify(tenants));
  } catch (err) {
    console.error('Error saving tenants:', err);
  }
};

// Helper: Generate random temporary password
export const generateTempPassword = (name = 'User') => {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'Rst';
  const cap = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const symbols = ['!', '@', '#', '$'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  return `${cap}@${randNum}${sym}`;
};

export const tenantService = {
  // Get all tenants (Super Admin portal)
  async getTenants() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredTenants());
      }, 200);
    });
  },

  // Get single tenant
  async getTenantById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenants = getStoredTenants();
        const tenant = tenants.find((t) => t.id === id);
        if (tenant) resolve(tenant);
        else reject(new Error('Tenant not found'));
      }, 150);
    });
  },

  // Register new tenant / restaurant
  async registerRestaurant(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!data.name || !data.email) {
          reject(new Error('Restaurant name and owner email are required!'));
          return;
        }

        const tenants = getStoredTenants();
        const existing = tenants.find((t) => t.email.toLowerCase() === data.email.toLowerCase());
        if (existing) {
          reject(new Error('A restaurant with this owner email is already registered!'));
          return;
        }

        const tenantId = `restro_${Date.now()}`;
        const tempPassword = generateTempPassword(data.ownerName || data.name);
        
        const newTenant = {
          id: tenantId,
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
          type: data.type || 'Restaurant',
          ownerName: data.ownerName || 'Restaurant Owner',
          email: data.email,
          phone: data.phone || 'N/A',
          address: data.address || 'N/A',
          tableCount: parseInt(data.tableCount, 10) || 10,
          subscription: {
            status: 'Active',
            plan: data.plan || 'Basic',
            renewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            monthlyPrice: data.plan === 'Premium' ? 2999 : data.plan === 'Enterprise' ? 4999 : 999
          },
          createdAt: new Date().toISOString()
        };

        // Create Admin User account for tenant owner
        const newAdminUser = {
          id: `u_admin_${Date.now()}`,
          name: data.ownerName || `${data.name} Admin`,
          email: data.email,
          role: 'admin',
          restaurantId: tenantId,
          phone: data.phone || '',
          tempPassword,
          status: 'Active',
          createdAt: new Date().toISOString()
        };

        // Save tenant
        const updatedTenants = [newTenant, ...tenants];
        saveStoredTenants(updatedTenants);

        // Also add admin user to mock users
        import('../mock/staffService').then(({ addMockUser }) => {
          addMockUser(newAdminUser);
        });

        resolve({
          tenant: newTenant,
          adminUser: newAdminUser,
          credentials: {
            email: data.email,
            tempPassword
          }
        });
      }, 300);
    });
  },

  // Update tenant subscription
  async updateSubscription(tenantId, newPlan, durationMonths = 12) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenants = getStoredTenants();
        const index = tenants.findIndex((t) => t.id === tenantId);
        if (index === -1) {
          reject(new Error('Tenant not found'));
          return;
        }

        const renewDate = new Date();
        renewDate.setMonth(renewDate.getMonth() + parseInt(durationMonths, 10));

        tenants[index].subscription = {
          ...tenants[index].subscription,
          plan: newPlan,
          status: 'Active',
          renewDate: renewDate.toISOString().split('T')[0],
          monthlyPrice: newPlan === 'Premium' ? 2999 : newPlan === 'Enterprise' ? 4999 : 999
        };

        saveStoredTenants(tenants);
        resolve(tenants[index]);
      }, 200);
    });
  },

  // Toggle tenant active/suspended status
  async updateStatus(tenantId, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenants = getStoredTenants();
        const index = tenants.findIndex((t) => t.id === tenantId);
        if (index === -1) {
          reject(new Error('Tenant not found'));
          return;
        }

        tenants[index].subscription.status = newStatus;
        saveStoredTenants(tenants);
        resolve(tenants[index]);
      }, 200);
    });
  }
};

export default tenantService;
