import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services';
import type { AdminUser, AdminStats } from '@/services/admin.service';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    Stethoscope,
    User as UserIcon,
    CheckCircle,
    XCircle,
    Activity
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [stats, setStats] = useState<AdminStats | null>(null);
    const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
    const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is admin
        if (user && user.role !== 'admin') {
            toast({
                title: 'Access Denied',
                description: 'You do not have permission to access this page',
                variant: 'destructive',
            });
            navigate('/dashboard');
            return;
        }

        if (user) {
            loadData();
        }
    }, [user, navigate]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsData, pendingData, allUsersData] = await Promise.all([
                adminService.getStats(),
                adminService.getPendingUsers(),
                adminService.getAllUsers(),
            ]);

            setStats(statsData);
            setPendingUsers(pendingData);
            setAllUsers(allUsersData);
        } catch (error) {
            console.error('Error loading admin data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load admin data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        try {
            setActionLoading(userId);
            await adminService.approveUser(userId);

            toast({
                title: 'Success',
                description: 'User approved successfully',
            });

            // Reload data
            await loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to approve user',
                variant: 'destructive',
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId: string) => {
        try {
            setActionLoading(userId);
            await adminService.rejectUser(userId);

            toast({
                title: 'Success',
                description: 'User rejected successfully',
            });

            // Reload data
            await loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to reject user',
                variant: 'destructive',
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            setActionLoading(userId);
            await adminService.deleteUser(userId);

            toast({
                title: 'Success',
                description: 'User deleted successfully. They will need to sign up again to regain access.',
            });

            // Reload data
            await loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete user',
                variant: 'destructive',
            });
        } finally {
            setActionLoading(null);
        }
    };

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color
    }: {
        title: string;
        value: number;
        icon: any;
        color: string;
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );

    const UserCard = ({ user, showActions }: { user: AdminUser; showActions: boolean }) => (
        <Card key={user._id} className="mb-4">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription className="mt-1">{user.email}</CardDescription>
                        <div className="flex gap-2 mt-3">
                            <Badge variant={user.userType === 'doctor' ? 'default' : 'secondary'}>
                                {user.userType === 'doctor' ? (
                                    <><Stethoscope className="w-3 h-3 mr-1" /> Doctor</>
                                ) : (
                                    <><UserIcon className="w-3 h-3 mr-1" /> Patient</>
                                )}
                            </Badge>
                            <Badge variant={user.isApproved ? 'default' : 'outline'}>
                                {user.isApproved ? (
                                    <><CheckCircle className="w-3 h-3 mr-1" /> Approved</>
                                ) : (
                                    <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                )}
                            </Badge>
                        </div>
                    </div>
                    {showActions && !user.isApproved && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(user._id)}
                                disabled={actionLoading === user._id}
                            >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(user._id)}
                                disabled={actionLoading === user._id}
                            >
                                <UserX className="w-4 h-4 mr-1" />
                                Reject
                            </Button>
                        </div>
                    )}
                    {!showActions && user.isApproved && user.role !== 'admin' && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(user._id)}
                                disabled={actionLoading === user._id}
                            >
                                <UserX className="w-4 h-4 mr-1" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            {user.userType === 'doctor' && (user.specialization || user.licenseNumber) && (
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {user.specialization && (
                            <div>
                                <p className="text-muted-foreground">Specialization</p>
                                <p className="font-medium">{user.specialization}</p>
                            </div>
                        )}
                        {user.licenseNumber && (
                            <div>
                                <p className="text-muted-foreground">License Number</p>
                                <p className="font-medium">{user.licenseNumber}</p>
                            </div>
                        )}
                    </div>
                    {user.approvedAt && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            Approved on {new Date(user.approvedAt).toLocaleDateString()}
                            {user.approvedBy && ` by ${user.approvedBy.name}`}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading admin dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage user registrations and approvals</p>
                </div>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers}
                            icon={Users}
                            color="text-blue-600"
                        />
                        <StatCard
                            title="Pending Approval"
                            value={stats.pendingUsers}
                            icon={Clock}
                            color="text-yellow-600"
                        />
                        <StatCard
                            title="Approved Users"
                            value={stats.approvedUsers}
                            icon={UserCheck}
                            color="text-green-600"
                        />
                        <StatCard
                            title="Total Doctors"
                            value={stats.totalDoctors}
                            icon={Stethoscope}
                            color="text-purple-600"
                        />
                    </div>
                )}

                {/* Tabs for Pending and All Users */}
                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="pending">
                            Pending Approvals ({pendingUsers.length})
                        </TabsTrigger>
                        <TabsTrigger value="all">
                            All Users ({allUsers.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-6">
                        {pendingUsers.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                                    <p className="text-lg font-medium">No pending approvals</p>
                                    <p className="text-muted-foreground">All users have been processed</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user) => (
                                    <UserCard key={user._id} user={user} showActions={true} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="all" className="mt-6">
                        {allUsers.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-lg font-medium">No users found</p>
                                    <p className="text-muted-foreground">No users have registered yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {allUsers.map((user) => (
                                    <UserCard key={user._id} user={user} showActions={false} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
