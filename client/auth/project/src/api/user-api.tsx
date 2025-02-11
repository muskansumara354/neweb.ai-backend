// userApi.ts

export async function sendUserData(userData: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<any> {
  const response = await fetch('http://localhost:8000/user/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send user data to backend');
  }

  return response.json();
}
